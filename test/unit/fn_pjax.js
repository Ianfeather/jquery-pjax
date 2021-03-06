if ($.support.pjax) {
  module("$.fn.pjax", {
    setup: function() {
      var self = this
      stop()
      window.iframeLoad = function(frame) {
        self.frame = frame
        window.iframeLoad = $.noop
        start()
      }
      $("#qunit-fixture").append("<iframe src='home.html'>")
    },
    teardown: function() {
      delete window.iframeLoad
    }
  })


  asyncTest("pushes new url", function() {
    var frame = this.frame

    frame.$("#main").pjax("a").on("pjax:end", function() {
      equal(frame.location.pathname, "/dinosaurs.html")
      start()
    })

    frame.$("a[href='/dinosaurs.html']").click()
  })

  asyncTest("replaces container html from response data", function() {
    var frame = this.frame

    frame.$("#main").pjax("a").on("pjax:end", function() {
      equal(frame.$("iframe").attr('title'), "YouTube video player")
      start()
    })

    frame.$("a[href='/dinosaurs.html']").click()
  })

  asyncTest("sets title to response title tag", function() {
    var frame = this.frame

    frame.$("#main").pjax("a").on("pjax:end", function() {
      equal(frame.document.title, "dinosaurs")
      start()
    })

    frame.$("a[href='/dinosaurs.html']").trigger('click')
  })


  asyncTest("uses second argument as container", function() {
    var frame = this.frame

    frame.$("body").pjax("a", "#main").on("pjax:end", "#main", function() {
      equal(frame.location.pathname, "/dinosaurs.html")
      start()
    })

    frame.$("a[href='/dinosaurs.html']").click()
  })

  asyncTest("uses second argument as options", function() {
    var frame = this.frame

    frame.$("#main").pjax("a", {push: true}).on("pjax:end", function() {
      equal(frame.location.pathname, "/dinosaurs.html")
      start()
    })

    frame.$("a[href='/dinosaurs.html']").click()
  })

  asyncTest("uses second argument as container and third as options", function() {
    var frame = this.frame

    frame.$("body").pjax("a", "#main", {push: true}).on("pjax:end", function() {
      equal(frame.location.pathname, "/dinosaurs.html")
      start()
    })

    frame.$("a[href='/dinosaurs.html']").click()
  })


  asyncTest("defaults to data-pjax container", function() {
    var frame = this.frame

    frame.$("a").attr('data-pjax', "#main")

    frame.$("body").pjax("a")

    frame.$("#main").on("pjax:end", function() {
      equal(frame.location.pathname, "/dinosaurs.html")
      start()
    })

    frame.$("a[href='/dinosaurs.html']").click()
  })

  asyncTest("sets relatedTarget to clicked element", function() {
    var frame = this.frame

    frame.$("#main").pjax("a")

    var link = frame.$("a[href='/dinosaurs.html']")[0]

    frame.$("#main").on("pjax:end", function(event, xhr, options) {
      equal(link, event.relatedTarget)
      start()
    })

    frame.$(link).click()
  })


  asyncTest("doesn't ignore left click", function() {
    var frame = this.frame

    frame.$("#main").pjax("a")

    var event = frame.$.Event('click')
    event.which = 0
    frame.$("a[href='/dinosaurs.html']").trigger(event)
    ok(event.isDefaultPrevented())

    start()
  })

  asyncTest("ignores middle clicks", function() {
    var frame = this.frame

    frame.$("#main").pjax("a")

    var event = frame.$.Event('click')
    event.which = 3
    frame.$("a[href='/dinosaurs.html']").trigger(event)
    ok(!event.isDefaultPrevented())

    start()
  })

  asyncTest("ignores command clicks", function() {
    var frame = this.frame

    frame.$("#main").pjax("a")

    var event = frame.$.Event('click')
    event.metaKey = true
    frame.$("a[href='/dinosaurs.html']").trigger(event)
    ok(!event.isDefaultPrevented())

    start()
  })

  asyncTest("ignores ctrl clicks", function() {
    var frame = this.frame

    frame.$("#main").pjax("a")

    var event = frame.$.Event('click')
    event.ctrlKey = true
    frame.$("a[href='/dinosaurs.html']").trigger(event)
    ok(!event.isDefaultPrevented())

    start()
  })

  asyncTest("ignores cross origin links", function() {
    var frame = this.frame

    frame.$("#main").pjax("a")

    var event = frame.$.Event('click')
    frame.$("a[href='https://www.google.com/']").trigger(event)
    notEqual(event.result, false)

    start()
  })

  asyncTest("ignores same page anchors", function() {
    var frame = this.frame

    frame.$("#main").pjax("a")

    var event = frame.$.Event('click')
    frame.$("a[href='#main']").trigger(event)
    notEqual(event.result, false)

    start()
  })

  asyncTest("scrolls to anchor after load", function() {
    var frame = this.frame

    frame.$("#main").pjax("a").on("pjax:end", function() {
      equal(frame.location.pathname, "/dinosaurs.html")
      equal(frame.location.hash, "#main")
      start()
    })

    var link = frame.$("a[href='/dinosaurs.html']")
    link.attr('href', "/dinosaurs.html#main")
    link.click()
  })
}
