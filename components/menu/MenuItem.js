import React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';
const MenuItem = ({ icono, titulo }) => {
  const router = useRouter();
  return (
    <li className="menu-item">
      <Link href="/">
        <a >
          <span className="icon">
            <ion-icon name="settings-outline"></ion-icon>
          </span>
          <span className="title">{titulo}</span>
        </a>
      </Link>
    </li>
  );
};

export default MenuItem;
