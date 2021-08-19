import { useEffect, useState } from "react";

/*
  어떻게 하면 useDefault를 효율적으로 만들 수 있을까?
  이 작업의 궁극적인 목표는 uninitialized된 state를 initialize하는 것이다.
   - 이는 크게 생각했을 때 dictionary에 어떤 attribute를 추가하는 것으로도 생각할 수 있다.

  현재 useDefault 훅을 사용하는 곳은 전부 QuestionType이다.
  왜냐하면 모든 Question에 대한 정보를 전부 미리 만들어두기가 애매하기 때문이다.
  만약 그렇게 할 경우 Question에 대한 타입 정보가 getQuestion, 혹은 Controller,
  그리고 QuestionType 이 세 가지로 분산된다. 이는 DRY하지 않으므로 올바르지 못한 구현이다.

  만약 클래스를 이용할 수 있다고 가정해보면 어떨까?
  즉, React 컴포넌트에서는 데이터의 조작에 대한 대응을 전혀 하지 않고 오직 클래스에서만 데이터를 조작한다면 어떨까?
  이는 말 그대로 state를 클래스 형식으로 패킹해보자는 관점이다.
  이 경우 어떤 컴포넌트가 빈 state, setState를 받았을 때 어떻게 대응할 수 있는가?
  그리고 기존의 방식에 비해 어떤 이점이 있는가?
  - 사실 기존의 방식에 비해 큰 이점이 있는 것 같지는 않다.
*/

function checkUpdateAndGetNew(state, defaults, initialized) {
  if (initialized) return [false, null];

  if (typeof state === "object") {
    let shouldUpdate = false;
    for (const key in defaults) {
      if (!(key in state)) {
        shouldUpdate = true;
        break;
      }
    }

    if (shouldUpdate) {
      return [true, { ...defaults, ...state }];
    } else {
      return [false, null];
    }
  }

  if (typeof state !== typeof defaults) {
    return [true, defaults];
  }

  return [false, state];
}

export default function useDefault(state, setState, defaults) {
  const [initialized, setInitialized] = useState(false);

  // shouldUpdate is true when
  // 1. Initialized variable is not set (=false)
  // 2. State is not initialized.
  const [shouldUpdate, newState] = checkUpdateAndGetNew(state, defaults, initialized);

  useEffect(() => {
    if (!shouldUpdate) return;
    // If setState is not a function, it means that the state is not used.
    // Therefore, assume that it is initialized.
    if (setState) {
      setState(newState);
      setInitialized(true);
    }
  }, [shouldUpdate, setState, initialized, newState]);

  if (!setState) return true;
  if (!shouldUpdate) return true;

  return initialized;
}
