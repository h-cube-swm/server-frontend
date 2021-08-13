import useTimeout from "../../hooks/useTimeout";
import "./Hider.scss";

function Hider({ hide, children, animation = true, appearDelay = 0 }) {
  const isInit = useTimeout(appearDelay);
  hide |= !isInit;

  if (hide) return null;

  return children;
}

export default Hider;
