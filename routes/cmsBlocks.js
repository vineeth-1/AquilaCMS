/*
 * Product    : AQUILA-CMS
 * Author     : Nextsourcia - contact@aquila-cms.com
 * Copyright  : 2021 © Nextsourcia - All rights reserved.
 * License    : Open Software License (OSL 3.0) - https://opensource.org/licenses/OSL-3.0
 * Disclaimer : Do not edit or add to this file if you wish to upgrade AQUILA CMS to newer versions in the future.
 */

const ServiceCmsBlock             = require('../services/cmsBlocks');
const {authentication, adminAuth} = require('../middleware/authentication');

module.exports = function (app) {
    app.post('/v2/cmsBlocks', getCMSBlocks);
    app.post('/v2/cmsBlock', getCMSBlock);
    app.post('/v2/cmsBlock/:id', getCMSBlockById);
    app.put('/v2/cmsBlock', authentication, adminAuth, setCMSBlock);
    app.delete('/v2/cmsBlock/:code', authentication, adminAuth, deleteCMSBlock);
};

/**
 * POST /api/v2/cmsBlocks
 * @summary List of CMSBlocks
 * @apiSuccess {Array}  datas           Array of CMSBlocks
 * @apiSuccess {String} datas.code      Code of the CMSBlock
 * @apiSuccess {Number} datas.content   HTML content of the CMSBlock (from translation[lang] fields)
 */
async function getCMSBlocks(req, res, next) {
    try {
        const result = await ServiceCmsBlock.getCMSBlocks(req.body.PostBody);
        if (!req.headers.authorization || (req.info && !req.info.isAdmin)) {
            // on boucle sur les resultats
            for (let i = 0; i < result.datas.length; i++) {
                const block = result.datas[i];
                if (block.translation) {
                    // on boucle sur les langues contenue
                    for (let k = 0; k < Object.keys(block.translation).length; k++) {
                        const langKey = Object.keys(block.translation)[k];
                        delete block.translation[langKey].variables;
                        delete block.translation[langKey].html;
                    }
                }
            }
        }
        return res.json(result);
    } catch (error) {
        return next(error);
    }
}

/**
 * @api {post} /v2/cmsBlock Get CMSBlock
 * @apiName getCMSBlock
 */
async function getCMSBlock(req, res, next) {
    try {
        const result = await ServiceCmsBlock.getCMSBlock(req.body.PostBody);
        if ((!req.headers.autorization || (req.info && !req.info.isAdmin)) && result.translation) {
            // on boucle sur les langues contenue
            for (let k = 0; k < Object.keys(result.translation).length; k++) {
                const langKey = Object.keys(result.translation)[k];
                delete result.translation[langKey].variables;
                delete result.translation[langKey].html;
            }
        }
        return res.json(result);
    } catch (error) {
        return next(error);
    }
}

async function getCMSBlockById(req, res, next) {
    try {
        const result = await ServiceCmsBlock.getCMSBlockById(req.params.id, req.body.PostBody);
        if ((!req.headers.autorization || (req.info && !req.info.isAdmin)) && result.translation) {
            // on boucle sur les langues contenue
            for (let k = 0; k < Object.keys(result.translation).length; k++) {
                const langKey = Object.keys(result.translation)[k];
                delete result.translation[langKey].variables;
                delete result.translation[langKey].html;
            }
        }
        return res.json(result);
    } catch (error) {
        return next(error);
    }
}

async function setCMSBlock(req, res, next) {
    try {
        const result = await ServiceCmsBlock.setCMSBlock(req.body);
        return res.json(result);
    } catch (error) {
        return next(error);
    }
}

async function deleteCMSBlock(req, res, next) {
    try {
        const result = await ServiceCmsBlock.deleteCMSBlock(req.params.code);
        return res.json(result);
    } catch (error) {
        return next(error);
    }
}
