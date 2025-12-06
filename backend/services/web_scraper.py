"""
Web Scraper Service - Fetch and process web content for AI context.
Provides search and content extraction capabilities.
"""

import httpx
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
from dataclasses import dataclass
from duckduckgo_search import DDGS
from config import get_settings


settings = get_settings()


@dataclass
class SearchResult:
    """Represents a search result with extracted content."""
    title: str
    url: str
    snippet: str
    content: Optional[str] = None


class WebScraperService:
    """Service for web searching and content extraction."""
    
    def __init__(self):
        self.timeout = settings.scrape_timeout
        self.max_results = settings.max_search_results
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

    async def search(self, query: str, max_results: Optional[int] = None) -> List[SearchResult]:
        """
        Search the web using DuckDuckGo.
        
        Args:
            query: Search query string
            max_results: Maximum number of results to return
            
        Returns:
            List of SearchResult objects
        """
        results = []
        num_results = max_results or self.max_results
        
        try:
            with DDGS() as ddgs:
                search_results = list(ddgs.text(
                    query,
                    max_results=num_results
                ))
                
                for result in search_results:
                    results.append(SearchResult(
                        title=result.get('title', ''),
                        url=result.get('href', ''),
                        snippet=result.get('body', '')
                    ))
        except Exception as e:
            print(f"Search error: {str(e)}")
            
        return results

    async def scrape_url(self, url: str) -> Optional[str]:
        """
        Scrape content from a URL.
        
        Args:
            url: The URL to scrape
            
        Returns:
            Extracted text content or None if failed
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, headers=self.headers, follow_redirects=True)
                
                if response.status_code != 200:
                    return None
                
                soup = BeautifulSoup(response.text, 'lxml')
                
                # Remove unwanted elements
                for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside', 'iframe']):
                    element.decompose()
                
                # Extract main content
                main_content = soup.find('main') or soup.find('article') or soup.find('body')
                
                if main_content:
                    # Get text and clean it up
                    text = main_content.get_text(separator='\n', strip=True)
                    # Remove excessive whitespace
                    lines = [line.strip() for line in text.splitlines() if line.strip()]
                    text = '\n'.join(lines)
                    # Limit content length
                    return text[:5000] if len(text) > 5000 else text
                    
                return None
        except Exception as e:
            print(f"Scrape error for {url}: {str(e)}")
            return None

    async def search_and_scrape(self, query: str, max_results: Optional[int] = None) -> Dict:
        """
        Search the web and scrape content from top results.
        
        Args:
            query: Search query
            max_results: Number of results to process
            
        Returns:
            Dictionary with search results and combined context
        """
        results = await self.search(query, max_results)
        
        # Scrape content from top results
        scraped_count = 0
        for result in results[:3]:  # Only scrape top 3
            content = await self.scrape_url(result.url)
            if content:
                result.content = content
                scraped_count += 1
        
        # Build combined context for AI
        context_parts = []
        sources = []
        
        for result in results:
            source_info = {
                "title": result.title,
                "url": result.url,
                "snippet": result.snippet
            }
            sources.append(source_info)
            
            if result.content:
                context_parts.append(f"Source: {result.title}\nURL: {result.url}\n\n{result.content[:2000]}")
        
        combined_context = "\n\n---\n\n".join(context_parts) if context_parts else None
        
        return {
            "query": query,
            "sources": sources,
            "context": combined_context,
            "scraped_count": scraped_count
        }

    async def scrape_university_page(self, url: str) -> Dict:
        """
        Specialized scraper for university websites.
        
        Args:
            url: University page URL
            
        Returns:
            Structured content from the page
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, headers=self.headers, follow_redirects=True)
                
                if response.status_code != 200:
                    return {"error": f"Failed to fetch: {response.status_code}"}
                
                soup = BeautifulSoup(response.text, 'lxml')
                
                # Extract structured information
                data = {
                    "url": url,
                    "title": soup.title.string if soup.title else "",
                    "headings": [],
                    "content": "",
                    "links": []
                }
                
                # Get headings
                for heading in soup.find_all(['h1', 'h2', 'h3']):
                    data["headings"].append({
                        "level": heading.name,
                        "text": heading.get_text(strip=True)
                    })
                
                # Get main content
                main = soup.find('main') or soup.find('article') or soup.find('body')
                if main:
                    for element in main(['script', 'style', 'nav', 'footer']):
                        element.decompose()
                    data["content"] = main.get_text(separator='\n', strip=True)[:5000]
                
                # Get important links
                for link in soup.find_all('a', href=True)[:20]:
                    href = link.get('href', '')
                    text = link.get_text(strip=True)
                    if text and len(text) > 3:
                        data["links"].append({"text": text, "href": href})
                
                return data
        except Exception as e:
            return {"error": str(e)}


# Singleton instance
web_scraper = WebScraperService()
