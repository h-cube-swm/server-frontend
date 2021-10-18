function inspect() {
  function recursive(element, func = () => {}) {
    func(element);
    if (element.hasChildNodes()) {
      const children = element.children;
      for (let i = 0; i < children.length; i++) {
        recursive(children[i], func);
      }
    }
  }

  function scrollCheck(element) {
    if (element.clientHeight != element.scrollHeight)
      console.log(element, element.clientHeight, element.scrollHeight);
  }

  const root = document.getElementById("root");
  recursive(root, scrollCheck);
  return "Finished";
}
