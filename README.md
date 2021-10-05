# server-frontend

![Build Test](https://github.com/h-cube-swm/server-frontend/actions/workflows/build-deploy.yaml/badge.svg)

## Note

`setNestedState(setState,keys)` 함수는 Nested된 오브젝트의 업데이트를 간단하게 만들어준다. 첫 번째 인자는 다루고자 하는 state의 setState함수이며 두 번째 인자는 건드릴 속성에 접근하기 위한 키들이다. 예를 들어 아래와 state를 고려해보자.

```js
state = {
  choices: ["Choice 1", "Choice 2"],
};
```

이때 `choices`의 각 요소를 업데이트하고자 한다. 이 기능을 `setNestedState` 함수를 사용하지 않고 immutable하게 구현하면 아래와 같이 구현해야 한다.

```js
const setText = (newText) => {
  setQuestion((question) => {
    const choices = [...question.choices];
    choices[i] = newText;
    return { ...question, choices };
  });
};
```

그러나 `setNestedState` 함수를 사용하면 아래와 같이 간단하게 구현할 수 있다.

```js
const setText = setNestedState(setQuestion, ["choices", i]);
```

이렇게 생성된 `setText` 함수는 리액트에서 `useState`를 사용하여 생성한 것과 마찬가지로 바로 값을 넣을 수도 있고 콜백 함수를 전달할 수도 있다.
