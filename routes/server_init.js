var settings = require('../settings.js'),
    RSVP = require('rsvp'),
    api_base = require('../api/api_base.js');

var VERBS = ["get", "post", "put", "delete"];

function setRoutes(server, route_obj) {
  /* FIND OUT WHICH OF THE VERBS HAVE BEEN SET FOR THIS ROUTE */
  var available_verbs = VERBS.filter(function(verb) { return route_obj.hasOwnProperty(verb); }), // && typeof route_obj[verb] === "function" }),
      route_actions;
  for (var i=0, len=available_verbs.length; i<len; i++) {
    verb = available_verbs[i];
    console.log("setting: " + verb + ":  "+ route_obj.route );
    route_actions = [route_obj.route];
    if(route_obj.auth) {
      if(route_obj.auth === "admin") {
        route_actions.push(requireAdminAuthentication);
      } else {
        route_actions.push(requireAuthentication);
      }
    }
    if(route_obj.logout) {
      route_actions.push(forceLogout);
    }
    if(route_obj.add_csrf) {
      route_actions.push(addCSRF);
    }
    if(route_obj.response_format) {
      if(route_obj.response_format === "json") {
        route_actions.push(setJSON);
      }
    }
    if(route_obj[verb].length && route_obj[verb].slice) { // ghetto array check
      route_actions = route_actions.concat(route_obj[verb]);
    } else {
      route_actions.push(route_obj[verb]);
    }

    server[verb].apply(server,route_actions);
  }
}

function generateErrorResponse(req, res, code, message) {
  if(req.accepts('json, text') || req.accepts('application/json')) {
    message = api_base.standard_response(message, code);
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.status(code).send(message);
  } else {
    res.status(code).send(message);
  }
}

function addCSRF(req, res, next) {
  if (req.csrfToken) {
    var token = req.csrfToken();
    res.locals.csrf_token = token;
    res.cookie('_csrf', token);
  } else {
    console.log ('no csrftoken method');
  }
  //console.log(res.cookies._csrf)
  next();
}

function setJSON(req, res, next) {
  res.set('Content-Type', 'application/json; charset=utf-8');
  next();
}

function requireAuthentication(req, res, next) {
  if(_requireAuthentication(req, res, next)) {
    next();
  } else {
    generateErrorResponse(req, res, 403, 'Nice try buckaroo');
  }
}

function requireAdminAuthentication(req, res, next) {
  if(_requireAdminAuthentication(req, res, next)) {
    next();
  } else {
    res.redirect("/");
  }
}

function requireLoggedInUserAuthentication(req, res, next) {
  if(_requireLoggedInUserAuthentication(req, res, next)) {
    next();
  } else {
    generateErrorResponse(req, res, 403, 'Nice try buckaroo');
  }
}

function _requireAuthentication(req, res, next) {
  if(req.user) {
    return true;
  } else {
    return false;
  }
}

function _requireAdminAuthentication(req, res, next) {
  if(req.user) {
    return req.user.isAdmin();
  } else {
    return false;
  }
}

function _requireLoggedInUserAuthentication(req, res, next) {
  return (req.user && req.user.login && req.user.login === req.params.user_id);
}

function forceLogout(req, res, next) {
  req.session = null;
  next();
}

function init(server, routing_table) {
  var route_obj;
  for (var i=0, len = routing_table.length; i<len; i++) {
    setRoutes(server, routing_table[i]);
  }
}

module.exports = {init:init};
