function bindToTextInput(textArea, rtString) {
  var events = ['input'];
  textArea.value = rtString.value();
  var oldVal = rtString.value();

  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    textArea.addEventListener(event, handleTextAreaEvent, false);
  }

  function handleTextAreaEvent() {
    var newValue = textArea.value;
    processEvent(oldVal, newValue);
    oldVal = newValue;
  }

  function processEvent(oldval, newval) {
    var commonEnd;
    var commonStart;

    if (oldval === newval) {
      return;
    }

    commonStart = 0;
    while (oldval.charAt(commonStart) === newval.charAt(commonStart)) {
      commonStart++;
    }

    commonEnd = 0;
    while (oldval.charAt(oldval.length - 1 - commonEnd) === newval.charAt(newval.length - 1 - commonEnd) &&
    commonEnd + commonStart < oldval.length && commonEnd + commonStart < newval.length) {
      commonEnd++;
    }

    if (oldval.length !== commonStart + commonEnd) {
      rtString.remove(commonStart, oldval.length - commonStart - commonEnd);
    }

    if (newval.length !== commonStart + commonEnd) {
      rtString.insert(commonStart, newval.slice(commonStart, (newval.length - commonEnd)));
    }
  }

  rtString.on("insert", function (event) {
    var oldVal = textArea.value;
    textArea.value = oldVal.substring(0, event.index) +
      event.value +
      oldVal.substring(event.index, oldVal.length);
  });

  rtString.on("remove", function (event) {
    var oldVal = textArea.value;
    textArea.value = oldVal.substring(0, event.index) +
      oldVal.substring(event.index + event.value.length, oldVal.length);
  });

  rtString.on("set", function (event) {
    textArea.value = event.value;
  });
}
//
// Input Element Bindings
//

function bindNumberInput(numberInput, numberModel) {
  numberInput.value = numberModel.value();
  numberInput.onchange = function (e) {
    numberModel.setValue(Number(numberInput.value));
  };

  numberModel.on("set", function (evt) {
    numberInput.value = evt.value;
  });

  numberModel.on("add", function (evt) {
    numberInput.value = Number(numberInput.value) + evt.value;
  });
}

function bindCheckboxInput(checkboxInput, booleanModel) {
  booleanInput.checked = booleanModel.value();
  booleanInput.onchange = function (e) {
    booleanModel.setValue(booleanInput.checked);
  };

  booleanModel.on("set", function (evt) {
    booleanInput.checked = evt.value;
  });
}


function appendToConsole(message) {
  var line = document.createElement("div");
  line.innerText = message;
  consoleDiv.appendChild(line);
}