import React from 'react';

import classNames from 'classnames/bind';

import styles from './CategoryNavView.scss';

const cx = classNames.bind(styles);

const CategoryNavView = () => {
  return (
    <>
      <h2 className={cx('readableHidden')}>카테고리 메뉴</h2>
      <ul className={cx('categoryList')}>
        <li className={cx('categoryItem')}>
          <a href="#">모두</a>
        </li>
        <li className={cx('categoryItem')}>
          <a href="#">식당</a>
        </li>
        <li className={cx('categoryItem')}>
          <a href="#">카페</a>
        </li>
        <li className={cx('categoryItem')}>
          <a href="#">주점</a>
        </li>
      </ul>
    </>
  );
};

export default CategoryNavView;