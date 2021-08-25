import React from "react";
import "./Firework.scss";

import particle1 from "../../../../../assets/icons/particles/particle-1.svg";
import particle2 from "../../../../../assets/icons/particles/particle-2.svg";
import particle3 from "../../../../../assets/icons/particles/particle-3.svg";
import particle4 from "../../../../../assets/icons/particles/particle-4.svg";
import particle5 from "../../../../../assets/icons/particles/particle-5.svg";

export default function Firework() {
  return (
    <div className="firework">
      <div className="part1">
        <img className="particle1" src={particle1} alt="fire work particle" />
        <img className="particle2" src={particle2} alt="fire work particle" />
        <img className="particle5" src={particle5} alt="fire work particle" />
      </div>
      <div className="part2">
        <img className="particle2" src={particle2} alt="fire work particle" />
        <img className="particle3" src={particle3} alt="fire work particle" />
        <img className="particle4" src={particle4} alt="fire work particle" />
        <img className="particle5" src={particle5} alt="fire work particle" />
      </div>
      <div className="part3">
        <img className="particle3" src={particle3} alt="fire work particle" />
        <img className="particle4" src={particle4} alt="fire work particle" />
        <img className="particle5" src={particle5} alt="fire work particle" />
      </div>
    </div>
  );
}
