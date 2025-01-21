import React from 'react';
import clsx from "clsx";
import styles from '../styles/svgComp.module.css';

const SvgComponent = () => {
  return (
    <div className={clsx("hidden lg:flex",styles.container)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 300"
        className={styles.svg}
      >
        <defs>
          {/* Cambiar a radialGradient */}
          <radialGradient id="gradientFill" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" spreadMethod="pad">
            <stop offset="0%" className={styles.gradientStart} />
            <stop offset="100%" className={styles.gradientEnd} />
          </radialGradient>
        </defs>
        <path
          className={styles.svgPath}
          d="M225.724698,23.220981h-146.329682c0,0-14.788276,0-14.788276,0s0,14.753863,0,14.753863v205.875143c0,0,0,21.318548,0,21.318548s17.074218.000011,17.074218.000011l143.974468-.000001-.000001-8.239704-153.558053-.000001v-224.719104h153.558053l.069273-8.988755Z"
        />
      </svg>
    </div>
  );
};

export default SvgComponent;
