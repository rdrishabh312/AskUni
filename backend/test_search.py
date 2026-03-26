import httpx

print("Testing direct scrape...")
url = "https://www.vidya.edu.in"
try:
    with httpx.Client(follow_redirects=True, timeout=10) as client:
        resp = client.get(url, headers={"User-Agent": "Mozilla/5.0"})
        print(f"Status: {resp.status_code}")
        print(f"Content length: {len(resp.text)}")
except Exception as e:
    print(f"Error: {e}")
