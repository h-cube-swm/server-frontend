import React, { useRef } from "react";
import "./TextField.scss";

function TextField({ text, setText, disabled, size, multiline, placeholder, ...props }) {
  const ref = useRef(null);

  // Build classname
  const classes = ["text-field"];
  if (size) classes.push(size);
  if (disabled) classes.push("gray viewmode");
  if (!text) classes.push("gray");
  if (!setText) classes.push("viewmode");
  if (multiline) classes.push("multiline");
  const className = classes.join(" ");

  const handleOnChange = () => {
    const cur = ref.current;
    if (disabled) return;
    if (!cur) return;
    if (!multiline) cur.value = cur.value.replace(/\n/g, "");
    setText(cur.value);
  };

  if (!setText) {
    if (text) {
      return (
        <div tabIndex="-1" className={className}>
          {text}
        </div>
      );
    }
    return (
      <div tabIndex="-1" className={className}>
        {placeholder}
      </div>
    );
  }

  /**
   * 만약 value에서 text?text:""로 해주지 않고 그냥 text를 곧바로 넘긴다고 가정해보자.
   * 그러면 텍스트가 한번 주어졌다가 추후에 null이나 undefined로 바뀌었을 경우에 문제가 발생한다.
   * 왜냐하면 React에서 attribute가 null이거나 undefined인 경우 실제 DOM을 초기화하는 것이 아니라
   * 그 값을 그대로 두기 때문이다.
   *
   * 즉, text="ASDF"로 설정한 후 text=null로 다시 설정하면 기대한 효과는 텍스트가 placeholder로 초기화되는 것이다.
   * 그러나 아래와 같이 검사를 해주지 않고 value=null을 바로 할당하게 되면 기존의 텍스트가 그대로 남아있게 된다.
   */
  return (
    <textarea
      className={className}
      ref={ref}
      rows={1}
      {...props}
      onChange={handleOnChange}
      value={text || ""}
      disabled={disabled || !setText}
      placeholder={placeholder}
    />
  );
}

export default TextField;
