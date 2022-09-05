const Router = require('@tsndr/cloudflare-worker-router')
const router = new Router()

router.cors()

async function getPost(sort, limit) {
    const response = await fetch(
        `https://www.reddit.com/r/ShowerThoughts.json?sort=${sort}&t=all&limit=${limit}`
    )
    const data = await response.json()
    const posts = data.data.children
    return posts[Math.floor(Math.random() * posts.length)].data;
}

router.get('/', async (req, res) => {
    const sort = req.query.sort || 'new'
    const limit = req.query.limit || 100

    let post = await getPost(sort, limit);

    let postValue = await THOUGHTS.get(post.id);

    // If the post value is not null, it means that the post has already been generated, so we generate a new one
    while (postValue != null) {
        post = await getPost();
        postValue = await THOUGHTS.get(post.id);
    }

    // Set the post value to true, so that we know that the post has already been generated
    await THOUGHTS.put(post.id, true, { expirationTtl: 600 });

    res.body = {
        data: post,
    }
})

addEventListener('fetch', event => {
    event.respondWith(router.handle(event))
})
