import dbClient from '../utils/db.js'

async function postNew(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
        res.status(400);
        return res.json({error: 'Missing email'});
    }

    if (!password) {
        res.status(400);
        return res.json({error: 'Missing password'});
    }

    const exist = await dbClient.doesUserExist();
    if (exist) {
        res.status(400);
        return res.json({error: 'Already exist'});
    }

    const newId = await dbClient.createUser(email, password);

    res.status(201);
    return res.json({id: newId, email: email});
}
export default postNew;
