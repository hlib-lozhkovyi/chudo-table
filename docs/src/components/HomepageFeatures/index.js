import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Declarative Approach',
    icon: '🧱',
    description: (
      <>
        Improve code readability. <br />
        Focus on high level abstractions, not a low code implementation.
      </>
    ),
  },
  {
    title: 'Ready To Go',
    icon: '🚀',
    description: (
      <>
        ChudoTable come with built-in features support such as remote data, sorting, filtering, and pagination out of
        the box.
      </>
    ),
  },
  {
    title: 'Fully Customizable',
    icon: '🧩',
    description: (
      <>Extendable by design. Replace components. Write your own plugins: custom filtering or events listener.</>
    ),
  },
];

function Feature({ icon, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <span className={styles.featureIcon}>{icon}</span>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
