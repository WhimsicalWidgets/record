import React from 'react'

import styles from './GitHubFooter.module.css'

function GitHubFooter({ repoUrl }: { repoUrl: string }) {
  return (
    <footer className={styles.footer}>
      <a href={repoUrl} className={styles.button}>
        <span className={styles.logo}></span>
        GitHub
      </a>
    </footer>
  )
}

export default GitHubFooter
