# shower-thoughts

A simple Cloudflare Worker that returns random shower thought data from [r/showerthoughts](https://www.reddit.com/r/showerthoughts/).

### How it works

A fetch request is made once the API is called. The response is parsed and data is returned. The worker uses [Cloudflare KV](https://developers.cloudflare.com/workers/reference/storage/) to temporally store the shower thoughts once their generated. Thoughts already stored in the KV are not generated again, and are ignored.

### Usage

The API is available at `https://shower-thoughts.workers.dev/`.

```bash
curl https://shower-thoughts.workers.dev/
```

```json
{
  "data": {
      "title": "The word \"shower\" is a verb and a noun.",
      "url": "<url>",
      "author": "<author>",
      "subreddit": "Showerthoughts"
  }
}
```
