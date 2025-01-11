import React from 'react';

const Authorize = ({ allowedRoles, children }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (currentUser && allowedRoles.includes(currentUser.role)) {
    return <>{children}</>;
  }

  return null; // إخفاء العناصر إذا لم يكن للمستخدم الدور المطلوب
};

export default Authorize;
