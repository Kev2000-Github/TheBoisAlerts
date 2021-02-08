import express from 'express';
import { User } from '../database/User';

const router = express.Router();

async function findToken(fireBaseToken) {
    return await User.query().findOne("fireBaseToken", fireBaseToken);
}

router.post('/user/:token', async (req, res) => {
    const token = req.params.token;
    const user = await findToken(token);
    if (user) {
        res.send({ "Error": "TOKEN ALREADY EXISTS" });
        return;
    }
    const insertedToken = await User.query().insert({ fireBaseToken: token });
    res.send(true);
})

export { router as routes }