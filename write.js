/**
 * boxClass: 放置容器class
 * textArray：文本数组
 * title: 文章标题
 * signature: 署名
 * text: 文本
 * textArray: 文本截取的数组
 * isSignatureEnd: 签名是否结束
 * isDateEnd: 日期是否结束
 * paragraphLength：段落长度
 * paragraphIndex：当前所在段落
 * textLength：当前文本长度
 * textIndex：当前所在文本的位置
 */
function WRITE(obj) {
  this.boxClass = obj.box
  this.title = obj.title || null
  this.signature = obj.signature || null
  this.date = obj.date || null
  this.text = obj.text || 'Hello World!'
  this.textArray = this.text.split('\n')
  this.paragraphLength = this.textArray.length
  this.paragraphIndex = 0
  this.textLength = this.textArray[this.paragraphIndex].length
  this.textIndex = 0
  this.isSignatureEnd = false
  this.isDateEnd = false
  this.audioStarted = false;
  if (this.title && this.title != '') {
    this.newTitle()
  } else {
    this.newParagraph()
  }
}

WRITE.prototype.newTitle = function () {
  var h = '<p class="write-h1"><span class="cursor">&nbsp;&nbsp;&nbsp;</span></p>'
  $(this.boxClass).append(h)
  $('.text-box>p:last-child')[0].scrollIntoView();
  var timer = window.setTimeout(function () {
    this.addText(this.title)
  }.bind(this), 1000)
}

WRITE.prototype.newParagraph = function () {
  var p = '<p class="write-p" data-index="' + this.paragraphIndex + '"><span class="cursor">&nbsp;&nbsp;&nbsp;</span></p>'
  $(this.boxClass).append(p)
  $('.text-box>p:last-child')[0].scrollIntoView();
  var timer = window.setTimeout(function () {
    this.addParagraph()
  }.bind(this), (this.isSignatureEnd || this.isDateEnd) ? 0 : 3000)
}

WRITE.prototype.newSignature = function () {
  if (this.isSignatureEnd === false) {
    var p = '<p class="write-signature"><span class="cursor">&nbsp;&nbsp;&nbsp;</span></p>'
    $(this.boxClass).append(p)
    $('.text-box>p:last-child')[0].scrollIntoView();
    var timer = window.setTimeout(function () {
      this.addText(this.signature)
      this.isSignatureEnd = true
    }.bind(this), 0)
  } else if (this.isDateEnd === false) {
    var p = '<p class="write-signature"><span class="cursor">&nbsp;&nbsp;&nbsp;</span></p>'
    $(this.boxClass).append(p)
    $('.text-box>p:last-child')[0].scrollIntoView();
    var timer = window.setTimeout(function () {
      this.addText(this.date)
      this.isDateEnd = true
    }.bind(this), 0)
  }
}

WRITE.prototype.addParagraph = function () {
  if (this.textArray[this.paragraphIndex]) {
    this.addText(this.textArray[this.paragraphIndex])
  } else if (this.signature) {
    $('.cursor').remove()
    this.newSignature()
  }
}

WRITE.prototype.addText = function (text) {
  if (text && text.length > 0) {
    var _this = this
    var $cursor = $('.cursor')
    var length = text.length
    var timer2 = null
    var audio = $('audio')[0]
    var timer = window.setInterval(function () {
      if (_this.textIndex < length && (text[_this.textIndex] == ',' || text[_this.textIndex] == '，' || text[_this.textIndex] == '.') || text[_this.textIndex] == '。') {
        audio.muted = true;
        clearInterval(timer)
        timer = null
        $cursor.before(text[_this.textIndex])
        $('.text-box>p:last-child')[0].scrollIntoView();
        _this.textIndex++
        timer2 = setTimeout(function () {
          _this.addText(text)
        }, 1300)
      } else if (_this.textIndex < length) {
        audio.muted = false;
        if (!_this.audioStarted) {
          audio.play().then(() => {
            _this.audioStarted = true;
          }).catch(e => {
            console.error("Play error:", e); // 捕获 NotAllowedError
          });
        }
        $cursor.before(text[_this.textIndex])
        $('.text-box>p:last-child')[0].scrollIntoView();
        _this.textIndex++
      } else {
        audio.muted = true;
        clearInterval(timer)
        timer = null
        _this.paragraphIndex++
        _this.textIndex = 0
        $cursor.remove()
        $('.text-box>p:last-child')[0].scrollIntoView();
        _this.newParagraph()
      }
    }, 150)
  } else {

  }
}
