(function() {
  var window = this;
  var BookWorm = function(query, parameters) {
    this.init(query, parameters);
  };
  
  BookWorm.URL = function(){
    return 'https://www.googleapis.com/books/v1/volumes';
  };
  
  BookWorm.Extensions = {

    extend: function(target, object) {
      for (var i in object) {
        target[i] = object[i];
      }
    },

    jsonp: function(url, callback, callback_name) {
      var head = document.getElementsByTagName('head')[0],
          script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url;
      
      window[callback_name] = function(data) {
        callback(data);
        window[callback_name] = undefined;
        try {
          delete window[callback_name];
        } catch(e) {
          
        }
        head.removeChild(script);
      };

      head.appendChild(script);
    }

  };
  
  BookWorm.prototype = { 
    
    book_authors: function() {
      if (this.response) {
        var books = this.response.items,
            i,
            authors = [];
        if (books) {
          for (i=0; i < books.length; i += 1) {
            if (books[i].volumeInfo.authors) {
              authors[i] = books[i].volumeInfo.authors[0];
            } else {
              authors[i] = 'No Authors Found.';
            }
          }
          return authors;
        } else {
          return null;
        }
      } else {
        return null;
      }      
    },

    book_count: function(){
      var count = this.response.totalItems;
      if (count) {
        return count;  
      } else {
        return null;
      }
    },

    book_covers: function() {
      if (this.response) {
        var books = this.response.items,
            i,
            covers = [];
        if (books) {
          for (i=0; i < books.length; i += 1) {
            if (books[i].volumeInfo.imageLinks) {
              covers[i] = books[i].volumeInfo.imageLinks.thumbnail;
            } else {
              covers[i] = 'no_image.jpg';
            }
          }
          return covers;
        } else {
          return null;
        }
      } else {
        return null;
      }      
    },

    book_isbns: function() {
      if (this.response) {
        var books = this.response.items,
            i,
            isbns = [];
        if (books) {
          for (i=0; i < books.length; i += 1) {
            if (books[i].volumeInfo.industryIdentifiers) {
              isbns[i] = books[i].volumeInfo.industryIdentifiers[0].identifier;
            } else {
              isbns[i] = 'No ISBN Found.';
            }
          }
          return isbns;
        } else {
          return null;
        }
      } else {
        return null;
      }      
    },

    book_titles: function() {
      if (this.response) {
        var books = this.response.items,
            i,
            titles = [];
        if (books) {
          for (i=0; i < books.length; i += 1) {
            if (books[i].volumeInfo.title) {
              titles[i] = books[i].volumeInfo.title;
            } else {
              titles[i] = 'No Titles Found.';
            }
          }
          return titles;
        } else {
          return null;
        }
      } else {
        return null;
      }      
    },

    build_params: function(params) {
      var setup = this.parameters;
      var new_params = {};
      
      if (!params) {
        return new_params;
      }
      
      for (var key in params) {        
        if (setup[key]) {
          new_params[key] = params[key] + '';
        }
      }
      
      return new_params;
    },
    
    build_url: function(query, params){
      query = query || this.query_string;
      params = params;
      var param_string = 'q=' + encodeURIComponent(query);
      
      for (var key in params) {
        param_string += '&' + key + '=' + encodeURIComponent(params[key]);
      }
      
      return BookWorm.URL() + '?' + param_string;
    },    
    
    callback: 'bookworm_load',
    complete: false,
    loading: false,
    query_string: '',
    response: null,
    successful: false,

    init: function(query, params) {
      var self = this;
      
      self.query_string = query || '';
      self.parameters = self.build_params(params);
      self.url = self.build_url();
      
      return self;
    },

    load: function(results) {
      var extensions = BookWorm.Extensions;
      var caller = this;
      var nonce = Date.now();
      var url = caller.url;
      var callback = caller.callback + '_' + nonce;
      caller.loading = true;
      
      var js_function = function(data) {
        caller.loading = false;
        caller.response = data;
        caller.complete = true;
        if (!data.error) {
          caller.successful = true;
        }
        
        if (results) {
          results(data); 
        }
      };
      
      url += '&callback=' + callback;
      extensions.jsonp(url, js_function, callback);
    }
    
  };

  window.BookWorm = function(query, parameters) {
    return new BookWorm(query,parameters);
  };
  BookWorm.Extensions.extend(window.BookWorm, BookWorm);
  
})();