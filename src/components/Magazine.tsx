// //@ts-ignore
// import * as React from "react";
// import HTMLFlipBook from "react-pageflip";
// import Image from 'next/image';

// export const Magazine = () => {
//   const pageImages = Array.from({ length: 42 }, (_, index) => index + 1);

//   return (
//     <HTMLFlipBook width={700} height={800}>
//       {pageImages.map((pageNumber) => (
//         <div key={pageNumber} className="demoPage">
//           <Image
//             src={`/magazine/mag_page-${String(pageNumber).padStart(4, '0')}.jpg`}
//             width={700}
//             height={800}
//             alt={`mag${pageNumber}`}
//           />
//         </div>
//       ))}
//     </HTMLFlipBook>
//   );
// };