var api_base = {
  standard_response: function(data, code, txt) {
    code = code || 200;
    txt = txt || (code === 200 ? "OK" : "UNKNOWN_ERROR");
    return {
      status_code: code,
      data: data,
      status_txt: txt
    };
  }
};


module.exports = api_base;
