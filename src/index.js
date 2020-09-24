require('../db/mongoose')
const User = require('../models/user')
const express = require('express')
const UserLog = require('../models/log')
const app = express()
app.use(express.json())
    //code for creating user
app.post('/users', async(req, res) => {
        try {
            const user = new User(req.body)
            await user.save()
            res.send(user)
        } catch (error) {
            res.status(500).send(error)

        }
    })
    //set event_type = start for user
app.post('/log/:id/start', async(req, res) => {
        try {
            const session = new UserLog({
                event_type: "start",
                user: req.params.id
            })
            await session.save()
            res.send(session)
        } catch (error) {
            res.status(500).send(error)
        }
    })
    //set event_type = end for user
    // user has to provide his/her corporate id to get details  related his/her corporate
app.post('/log/:id/end/:CID', async(req, res) => {
    try {
        //add sessionlog with event_type= end
        const session = new UserLog({
            event_type: "end",
            user: req.params.id
        })
        await session.save()
            //find all users with your coprporate id
        const corporate = await User.find({ CorporateId: req.params.CID })
            //removing duplicate if there are any duplicate
        const data = corporate.filter(function(elem, pos) {
            return corporate.indexOf(elem) == pos;
        })
        let totalTime = 0 //store  total time spent  by corporate
        let count = 0 //get number of user who set event_type = end with provided corporateid
        let max = 0 // store user with maximum time spend
        for (let index = 0; index < data.length; index++) {
            // get end time and start time for each user in corporate
            const endTime = await UserLog.find({ user: data[index]._id, event_type: "end" })
            const startTime = await UserLog.find({ user: data[index]._id, event_type: "start" })
                // for user end time and start time both exist then only this conditin works
            if (endTime.length !== 0 && startTime.length !== 0) {
                count = count + 1
                    //use first index because if user pass multiple end request then we count only first request 
                console.log(endTime[0].timeStamp - startTime[0].timeStamp)
                const diff = endTime[0].timeStamp - startTime[0].timeStamp
                if (diff > max) {
                    max = diff
                }
                totalTime = totalTime + diff
            }
        }
        const timeInHours = totalTime / 3600000
        console.log('Total time spend by ' + req.params.CID + ' employess is ' + timeInHours + 'hours')
        console.log('Avarage time spent by user of ' + req.params.CID + ' is ' +
            timeInHours / count)
        console.log('User ' + req.params.id + ' spent maximum time ' + max / 3600000 + ' hours')
        res.send(session)
    } catch (e) {
        res.status(500).send(e)
    }

})
app.listen(8000, () => {
    console.log('server on 8000 port....')
})