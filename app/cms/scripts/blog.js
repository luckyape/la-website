/** GLOBAL PAGE FUNCTIONS **/
var forEach = function(array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]);
  }
};
var $ = function(id) {
  return document.getElementById(id);
};
var one = function(sel) {
  return document.querySelector(sel);
};
var all = function(sel) {
  return document.querySelectorAll(sel);
};

function camelCaseToDash(myStr) {
  return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function camelCaseToDash(myStr) {
  return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function todaysDate() {
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
  var today = year + '-' + month + '-' + day;
  return today;
}


/** LIST PAGE FUNCTIONS **/


function listCallback(list, grid, res) {
  console.info(res, list, grid);
  var resJSON = JSON.parse(res.target.response);
  var gridHead = grid.querySelectorAll('[data-table-col]');
  var cols = Array.prototype.map.call(gridHead, function(obj) {
    return obj.getAttribute('data-table-col');
  });
  var tableBody = grid.querySelector('.list-table-body');
  var listJSON = resJSON[list];
  for (var i = 0; i < listJSON.length; i++) {
    var newRow = tableBody.insertRow(tableBody.rows.length);
    var rowData = listJSON[i];
    populateRow(rowData, cols, newRow)
  }
}

function populateRow(rowData, cols, newRow) {
  for (var j = 0; j < cols.length; j++) {
    var newCell = newRow.insertCell(j);
    var col = cols[j];
    var colVal = rowData[col];
    addCell(newCell, col, colVal);
  }
  addFunctionsCell(newRow, rowData);
}

function addCell(newCell, col, colVal) {
  applyCellClass(newCell, col, colVal);
  var newText = document.createTextNode(colVal);
  newCell.appendChild(newText);
}

function addFunctionsCell(newRow, rowData) {
  var newCell = newRow.insertCell(newRow.length);
  var link = document.createElement('a');
  var itemId = rowData['_id'];
  link.setAttribute('href', '/blog.html?edit=' + itemId);
  var linkText = document.createTextNode('edit');
  link.appendChild(linkText);
  newCell.appendChild(link);
}

function applyCellClass(newCell, col, colVal) {
  var classList = col + '-col';
  if (colVal === true) {
    classList += ' col-true';
  } else if (colVal === false) {
    classList += ' col-false';
  }
  newCell.classList = classList;
}

function ajaxGetList(list, grid) {
  var url = '/list/' + list;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = listCallback.bind(xhr, list, grid);
  xhr.send();
}

var grids = all('[data-content-type]');

forEach(grids, function(index, grid) {
  var list = grid.getAttribute('data-content-type');
  ajaxGetList(list, grid);
});



/** BLOG PAGE FUNCTIONS **/
function Editor(input, preview) {
  this.update = function() {
    var title = $('title').value;
    var h1 = (title !== '') ? title + '\r\n===\r\n' : '';
    var previewText = (input.value !== '') ? h1 + input.value : '';
    preview.innerHTML = markdown.toHTML(h1 + input.value);
    togglePreview(previewText !== '');
  };
  $
  input.editor = this;
  this.update();
}
function togglePreview(toggle) {
  if (toggle) {
    $('preview-container').classList.add('active');
    $('markdown-guide').classList.add('active');
  } else {
    $('preview-container').classList.remove('active');
    $('markdown-guide').classList.remove('active');
  }
}
function updateFields(fieldUpdates) {
  if (fieldUpdates.length) {
    forEach(fieldUpdates, function(index, updateField) {
      var targetIds = updateField.getAttribute('data-update-fields').split(' ');
      for (var i = 0; i < targetIds.length; i++) {
        var targetId = targetIds[i]
        var elem = $(targetId);
        var elemVal = elem.value;
        console.info(targetId);
        switch (targetId) {
          case 'heroUrl':
            if (elemVal !== '') {
              var imgElem = document.createElement('img');
              heroImg.setAttribute('src', elemVal);
              heroContainer.classList.add('hero-added');
            }
            break;
          case 'pubDate':
            var publishedStateElem = $('publishState');
            if (publishedStateElem.checked) {
              elem.focus();
              elem.value = todaysDate();
            }
            break;
          case 'publishState':
            var publishedDateVal = $('pubDate').value;
            var publisheTime = new Date(publishedDateVal).getTime();
            var todayTime = new Date(todaysDate()).getTime();
            elem.checked = (publisheTime <= todayTime);
            break;
          case 'meta-model-url-slug':
          case 'urlSlug':
            if (elemVal === '') {
              var title = $('title');
              elem.value = slugify(title.value);
              elem.nextElementSibling.classList.add('active');
            }
            break;
          case 'htmlPreview':
            preview.update();
            break;
        }
      }
    });
  }
}

function processEditorForm(e) {
  if (e.preventDefault) e.preventDefault();
  ajaxPost(editorFormElem.elements, submitCallback, editorFormElem.getAttribute('action'));
  return false;
}

function processModalForm(e) {
  if (e.preventDefault) e.preventDefault();
  var fieldTargets = e.target.querySelectorAll('[data-target-field]');
  forEach(fieldTargets, function(index, targetField) {
    var targetId = targetField.getAttribute('data-target-field');
    var newVal = (['checkbox'].indexOf(targetField.type) > -1) ? targetField.checked : targetField.value;
    var target = $(targetId)
    target.value = newVal;
    target.dispatchEvent(new Event('change', { 'bubbles': true }));
  });
  forEach(modalInstances, function(index, modal) {
    modal.close();
  });
  return false;
}

function submitCallback(res) {
  var resJSON = JSON.parse(res.target.response);
  if (resJSON.errors) {
    /*
      if form elements are correct validation
      errors should never occur
    */
    validationErrorHandler(resJSON.errors);
  } else if (resJSON.success) {
    var fieldUpdates = resJSON.success;
    M.toast({ html: 'Saved' });
    forEach(editorFormElem, function(index, elem) {
      var val = fieldUpdates[elem.id]
      if (val) {
        setValue(elem, val);
      }
    });
  }
}

function setValue(elem, val) {
  if (['checkbox', 'radio'].indexOf(elem.type) > -1) {
    elem.checked = val;
  } else {
    elem.value = val;
  }
}

function validationErrorHandler(fieldErrors) {
  for (var field in fieldErrors) {
    var errors = fieldErrors[field];
    var elem = $(field);
    elem.classList.add('invalid');
    var fieldClass = camelCaseToDash(field);
    var errorID = 'error-' + fieldClass + '-';
    for (var i = 0; i < errors.length; i++) {
      var errMsgElem = $(errorID + errors[i]);
      if (errMsgElem) {
        errMsgElem.classList.remove('hide');
      }
    }
  }
}

/**
 * Takes a form node and sends it over AJAX.
 * @param {HTMLFormElement} form - Form node to send
 * @param {function} callback - Function to handle onload. 
 *                              this variable will be bound correctly.
 */
function ajaxPost(elems, callback, url) {
  var xhr = new XMLHttpRequest();
  var params = [].filter.call(elems, function(el) {
      return (['checkbox', 'radio', 'submit'].indexOf(el.type) === -1) || el.checked;
    })
    .filter(function(el) { return !!el.name; })
    .filter(function(el) { return !el.disabled; })
    .map(function(el) {
      return encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value);
    })
    .join('&');
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = callback.bind(xhr);
  xhr.send(params);
}

function loadForm(id, func) {
  var url = '/load/' + id;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = loadCallback.bind(xhr, func);
  xhr.send();
}

function loadCallback(func, res) {
  var resJSON = JSON.parse(res.target.response);
  var fields = Object.keys(resJSON);
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    var fieldObj = $(field);
    var val = resJSON[field];
    if (func === 'copy' && (['_id', 'fileName'].indexOf(field) > -1)) {
      continue;
    }
    setValue(fieldObj, val);
    fieldObj.dispatchEvent(new Event('change', { 'bubbles': true }));
    if(field === 'body') {
      togglePreview(val !== '');
    }
    var nextElem = fieldObj.nextElementSibling;
    if (nextElem && nextElem.tagName === 'LABEL') {
      nextElem.classList.add('active');
    }
  }
}

function initBlogForm() {
  if (qs['edit']) {
    loadForm(qs['edit'], 'edit');
  }
  var modals = all('.modal');
  var heroImg = $('hero-image');
  var heroContainer = $('hero-image-container');
  var modalInstances = [];
  var metaPanel = one('.meta-panel');
  var collapseMeta = M.Collapsible.init(metaPanel, {
    onCloseStart: function(e) {
      console.info(e);
      $('meta-modal-form').submit();
      return false;
    }
  });
  var bodyElem = $('body');
  preview = new Editor(bodyElem, $('htmlPreview'));
  bodyElem.addEventListener('keyup', function(e) {
    if ((e.keyCode || e.which) == 13) {
      preview.update();
    }
  }, true);
  editorFormElem = $('editorForm');
  var fieldsUpdateTargets = editorFormElem.querySelectorAll('[data-update-fields]');
  var modalForms = all('.modal-form');

  forEach(fieldsUpdateTargets, function(index, field) {
    field.setAttribute('onchange', 'updateFields([this])');
  });

  forEach(modals, function(index, modal) {
    modalInstances[index] = M.Modal.init(modal, {
      onOpenStart: function(modal) {
        var fieldTargets = modal.querySelectorAll('[data-target-field]');
        forEach(fieldTargets, function(index, modalField) {
          var targetId = modalField.getAttribute('data-target-field');
          var editorField = $(targetId);
          setValue(modalField, editorField.value);
          if (editorField.value) {
            modalField.nextElementSibling.classList.add('active');
          }
        });
      }
    });
  });

  forEach(modalForms, function(index, form) {
    if (form.attachEvent) {
      form.attachEvent('submit', processModalForm);
    } else {
      form.addEventListener('submit', processModalForm);
    }
  });

  if (editorFormElem.attachEvent) {
    editorFormElem.attachEvent('submit', processEditorForm);
  } else {
    editorFormElem.addEventListener('submit', processEditorForm);
  }
}
var preview;
var editorFormElem;


var qs = (function(a) {
  if (a == '') return {};
  var b = {};
  for (var i = 0; i < a.length; ++i) {
    var p = a[i].split('=', 2);
    if (p.length == 1)
      b[p[0]] = '';
    else
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
  }
  return b;
})(window.location.search.substr(1).split('&'));
