var express = require('express');
var router = express.Router();
var authentication = require('../authentication');
var request = require('request-promise');
var url = require('url');

var apiUrl = 'https://cad.onshape.com';
if (process.env.API_URL) {
  apiUrl = process.env.API_URL;
}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).send({
    authUri: authentication.getAuthUri(),
    msg: 'Authentication required.'
  });
}

router.post('/logout', function(req, res) {
  req.session.destroy();
  return res.send({});
});

router.get('/session', function(req, res) {
  if (req.user) {
    res.send({userId: req.user.id});
  } else {
    res.status(401).send({
      authUri: authentication.getAuthUri(),
      msg: 'Authentication required.'
    });
  }
});

var getDocuments = function(req, res) {
  request.get({
    uri: apiUrl + '/api/documents',
    headers: {
      'Authorization': 'Bearer ' + req.user.accessToken
    }
  }).then(function(data) {
    res.send(data);
  }).catch(function(data) {
    if (data.statusCode === 401) {
      authentication.refreshOAuthToken(req, res).then(function() {
        getDocuments(req, res);
      }).catch(function(err) {
        console.log('Error refreshing token or getting documents: ', err);
      });
    } else {
      console.log('GET /api/documents error: ', data);
    }
  });
};

var getElementList = function(req, res) {
  request.get({
    uri: apiUrl + '/api/documents/d/' + req.query.documentId + "/w/" + req.query.workspaceId + '/elements',
    headers: {
      'Authorization': 'Bearer ' + req.user.accessToken
    }
  }).then(function(data) {
    console.log('GOT ELEMENTS', data);
    res.send(data);
  }).catch(function(data) {
    if (data.statusCode === 401) {
      authentication.refreshOAuthToken(req, res).then(function() {
        getElementList(req, res);
      }).catch(function(err) {
        console.log('Error refreshing token or getting elements: ', err);
      });
    } else {
      console.log('GET /api/documents/elements error: ', data);
    }
  });
};

var getPartsList = function(req, res) {
  request.get({
    uri: apiUrl + '/api/parts/d/' + req.query.documentId + "/w/" + req.query.workspaceId,
    headers: {
      'Authorization': 'Bearer ' + req.user.accessToken
    }
  }).then(function(data) {
    res.send(data);
  }).catch(function(data) {
    if (data.statusCode === 401) {
      authentication.refreshOAuthToken(req, res).then(function() {
        getPartsList(req, res);
      }).catch(function(err) {
        console.log('Error refreshing token or getting elements: ', err);
      });
    } else {
      console.log('GET /api/parts/workspace error: ', data);
    }
  });
};

var getConfiguration = function(req, res) {
  request.get({
    // uri: `${apiUrl}/api/elements/d/${req.query.documentId}/e/${req.query.elementId}/configuration'`,
    uri: '/api/elements/d/6357a4c306b124e25201426b/w/7cf32041789e1bcb4efeda57/e/940f7d54dd73d34c9c07799f/configuration/',
    headers: {
      'Authorization': 'Bearer ' + req.user.accessToken
    }
  }).then(function(data) {
    console.log('GOT CONFIGURATION', data)
    res.send(data);
  }).catch(function(data) {
    console.log('ERROR GETTING CONFIGURATION', data)
    if (data.statusCode === 401) {
      authentication.refreshOAuthToken(req, res).then(function() {
        getConfiguration(req, res);
      }).catch(function(err) {
        console.log('Error refreshing token or getting configuration: ', err);
      });
    } else {
      console.log('GET /api/configuration error: ', data);
    }
  });
};

var getStl = function(req, res) {
  var url;
  if (req.query.partId != null) {
    url = apiUrl + '/api/parts/d/' + req.query.documentId +
    '/w/' + req.query.workspaceId + '/e/' + req.query.stlElementId +'/partid/'+ req.query.partId + '/stl/' +
    '?mode=' + 'text'  +
    '&scale=1&units=inch';
    console.log("** STL for partId " + req.query.partId);
  }
  else {
    url = apiUrl + '/api/partstudios/d/' + req.query.documentId +
    '/w/' + req.query.workspaceId + '/e/' + req.query.stlElementId + '/stl/' +
    '?mode=' + 'text'  +
    '&scale=1&units=inch';
    console.log("** STL for partId " + req.query.partId);
  }

  if (req.query.angleTolerance !== '' && req.query.chordTolerance !== '') {
    url += '&angleTolerance=' + req.query.angleTolerance +'&chordTolerance=' + req.query.chordTolerance;
  }

  request.get({
    uri: url,
    headers: {
      'Authorization': 'Bearer ' + req.user.accessToken
    }
  }).then(function(data) {
    res.send(data);
  }).catch(function(data) {
    if (data.statusCode === 401) {
      authentication.refreshOAuthToken(req, res).then(function() {
        getStl(req, res);
      }).catch(function(err) {
        console.log('Error refreshing token or getting elements: ', err);
      });
    } else {
      console.log('GET /api/parts/workspace error: ', data);
    }
  });
};

router.get('/documents', getDocuments);
router.get('/elements', getElementList);
router.get('/stl', getStl);
router.get('/parts', getPartsList);
router.get('/configuration', getConfiguration);

module.exports = router;
