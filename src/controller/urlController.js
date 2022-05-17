const urlModel = require("../models/urlModel")
const shortId = require('shortid')
const validUrl = require('valid-url')
const  baseUrl= 'http://localhost:3000'


const urlCreate = async function(req,res) {
    const {
        longUrl
    } = req.body // destructure the longUrl from req.body.longUrl

    // check base url if valid using the validUrl.isUri method
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base URL')
    }

    // if valid, we create the url code
    const urlCode = shortId.generate()

    // check long url if valid using the validUrl.isUri method
    if (validUrl.isUri(longUrl)) {
        try {
            /* The findOne() provides a match to only the subset of the documents 
            in the collection that match the query. In this case, before creating the short URL,
            we check if the long URL was in the DB ,else we create it.
            */
            let url = await urlModel.findOne({
                longUrl
            })

            // url exist and return the respose
            if (url) {
                res.json(url)
            } else {
                // join the generated short code the the base url
                const shortUrl = baseUrl + '/' + urlCode

                // invoking the Url model and saving to the DB
               let url = {
                    longUrl,
                    shortUrl,
                    urlCode,
                }
               const code= await urlModel.create(url)
               res.status(201).send({ status: true, message: "You already created Short Url for this Long Url", data: code });

            }
        }
        // exception handler
        catch (err) {
            console.log(err)
            res.status(500).json('Server Error')
        }
    } else {
        res.status(401).json('Invalid longUrl')
    }
}

module.exports.urlCreate = urlCreate;