import http.client
import concurrent.futures
import json


api_keys= os.getenv("BOOKING_API_KEY")
headers = {
    'x-rapidapi-key': api_keys,
    #  
    # The above is the API key in case things don't work
    'x-rapidapi-host': "sky-scrapper.p.rapidapi.com"
}

def extract_multiple_images(text, start_str, end_str, n):
    """Extracts multiple image URLs from API response."""
    results = []
    start_idx = 0

    while len(results) < n:
        start_idx = text.find(start_str, start_idx)
        if start_idx == -1:
            break
        start_idx += len(start_str)
        end_idx = text.find(end_str, start_idx)
        if end_idx == -1:
            break
        results.append(text[start_idx:end_idx])
    
    return results if results else ["No images found"]

def get_images_for_keyword(kword, n):
    """Fetch `n` image URLs for a given keyword."""
    kword = kword.replace(' ', '%')

    conn = http.client.HTTPSConnection("google-search72.p.rapidapi.com")

   

    conn.request("GET", f"/imagesearch?q={kword}&gl=us&lr=lang_en&num={n}&start=0", headers=headers)
    
    res = conn.getresponse()
    data = res.read().decode("utf-8").replace('"', "").replace("\\", "")

    return extract_multiple_images(data, "thumbnailImageUrl:", "originalImageUrl", n)

def fetch_images_parallel(keyword_list, n=1):
    """Fetch `n` images for multiple keywords simultaneously using multithreading and return JSON."""
    results = {}

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = {executor.submit(get_images_for_keyword, kw, n): kw for kw in keyword_list}
        
        for future in concurrent.futures.as_completed(futures):
            keyword = futures[future]
            try:
                results[keyword] = future.result()
            except Exception as e:
                results[keyword] = [f"Error: {str(e)}"]

    return json.dumps(results, indent=4)  # Convert dictionary to JSON format

# Example Usage
##keywords = ["cat", "dog", "sunset"]
##num_images = 3  # Number of images per category
#image_results_json = fetch_images_parallel(keywords, num_images)

# JSON Output
##print(image_results_json)


fetch_images_parallel


