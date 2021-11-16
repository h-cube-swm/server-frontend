import useTimeout from "hooks/useTimeout";
import "./Hider.scss";

function Hider({ hide, children, appearDelay = 0 }) {
  const isInit = useTimeout(appearDelay);
  const shouldHide = hide || !isInit;

  if (shouldHide) return null;

  return children;
}

export default Hider;
