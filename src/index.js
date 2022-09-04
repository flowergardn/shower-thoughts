const Router = require('@tsndr/cloudflare-worker-router')
const router = new Router()

router.cors()

async function getPost() {
    const response = await fetch(
        `https://www.reddit.com/r/ShowerThoughts.json?sort=new&t=all&limit=50`
    )
    const data = await response.json()
    const posts = data.data.children
    return posts[Math.floor(Math.random() * posts.length)].data;
}

router.get('/', async (req, res) => {
    let post = await getPost();

    let postValue = await THOUGHTS.get(post.id);

    // If the post value is not null, it means that the post has already been generated, so we generate a new one
    while (postValue != null) {
        post = await getPost();
        postValue = await THOUGHTS.get(post.id);
    }

    // Set the post value to true, so that we know that the post has already been generated
    await THOUGHTS.put(post.id, true);

    res.body = {
        data: post,
    }
})

addEventListener('fetch', event => {
    event.respondWith(router.handle(event))
})
