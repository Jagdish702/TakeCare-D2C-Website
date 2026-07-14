import { useRef, useEffect, useState } from 'react';

// Figma frame 12335:6587 — 1440×1250, p-120, column gap 60.
const CANVAS_W = 1440;
const CANVAS_H = 1250;

// Exact Figma SVG exports (pasted directly from Dev Mode), fill/stroke swapped
// for currentColor so each icon follows the tab's active-accent / inactive-gray state.
// Exported so the mobile section (FeaturesSectionMobile) can reuse the same
// icons/copy instead of duplicating them.
export const IconDoctor = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8.86956 10.8478C7.94707 10.8478 7.06236 10.4814 6.41006 9.82906C5.75776 9.17676 5.3913 8.29206 5.3913 7.36956V4.58696C5.3913 4.40246 5.4646 4.22552 5.59506 4.09506C5.72552 3.9646 5.90246 3.8913 6.08696 3.8913H6.78261C6.96711 3.8913 7.14405 3.81801 7.27451 3.68755C7.40497 3.55709 7.47826 3.38015 7.47826 3.19565C7.47826 3.01115 7.40497 2.83421 7.27451 2.70375C7.14405 2.57329 6.96711 2.5 6.78261 2.5H6.08696C5.53346 2.5 5.00264 2.71988 4.61126 3.11126C4.21988 3.50264 4 4.03346 4 4.58696V7.36956C4.00089 8.15547 4.19254 8.92941 4.55847 9.62492C4.9244 10.3204 5.45369 10.9167 6.10087 11.3626C6.72329 11.9103 7.22798 12.5787 7.58433 13.3272C7.94067 14.0758 8.14126 14.889 8.17391 15.7174C8.17391 17.0089 8.68695 18.2475 9.60017 19.1607C10.5134 20.0739 11.752 20.5869 13.0435 20.5869C14.335 20.5869 15.5736 20.0739 16.4868 19.1607C17.4 18.2475 17.913 17.0089 17.913 15.7174V14.9243C18.5688 14.755 19.1403 14.3524 19.5204 13.7918C19.9005 13.2313 20.0632 12.5513 19.9778 11.8795C19.8925 11.2076 19.565 10.5899 19.0569 10.1422C18.5487 9.69449 17.8947 9.44749 17.2174 9.44749C16.5401 9.44749 15.8861 9.69449 15.3779 10.1422C14.8697 10.5899 14.5423 11.2076 14.457 11.8795C14.3716 12.5513 14.5342 13.2313 14.9144 13.7918C15.2945 14.3524 15.866 14.755 16.5217 14.9243V15.7174C16.5217 16.6399 16.1553 17.5246 15.503 18.1769C14.8507 18.8292 13.966 19.1956 13.0435 19.1956C12.121 19.1956 11.2363 18.8292 10.584 18.1769C9.93167 17.5246 9.56522 16.6399 9.56522 15.7174C9.59963 14.8879 9.80238 14.0742 10.1612 13.3255C10.5199 12.5769 11.0272 11.909 11.6522 11.3626C12.2968 10.9152 12.8234 10.3182 13.1868 9.62279C13.5503 8.92738 13.7398 8.15423 13.7391 7.36956V4.58696C13.7391 4.03346 13.5193 3.50264 13.1279 3.11126C12.7365 2.71988 12.2057 2.5 11.6522 2.5H10.9565C10.772 2.5 10.5951 2.57329 10.4646 2.70375C10.3342 2.83421 10.2609 3.01115 10.2609 3.19565C10.2609 3.38015 10.3342 3.55709 10.4646 3.68755C10.5951 3.81801 10.772 3.8913 10.9565 3.8913H11.6522C11.8367 3.8913 12.0136 3.9646 12.1441 4.09506C12.2745 4.22552 12.3478 4.40246 12.3478 4.58696V7.36956C12.3478 7.82633 12.2579 8.27863 12.0831 8.70064C11.9083 9.12264 11.6521 9.50608 11.3291 9.82906C11.0061 10.1521 10.6226 10.4083 10.2006 10.5831C9.77863 10.7579 9.32633 10.8478 8.86956 10.8478ZM17.2174 13.6304C16.8484 13.6304 16.4945 13.4838 16.2336 13.2229C15.9727 12.962 15.8261 12.6081 15.8261 12.2391C15.8261 11.8701 15.9727 11.5162 16.2336 11.2553C16.4945 10.9944 16.8484 10.8478 17.2174 10.8478C17.5864 10.8478 17.9403 10.9944 18.2012 11.2553C18.4621 11.5162 18.6087 11.8701 18.6087 12.2391C18.6087 12.6081 18.4621 12.962 18.2012 13.2229C17.9403 13.4838 17.5864 13.6304 17.2174 13.6304Z" fill="currentColor" />
  </svg>
);
export const IconMedicine = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M18.5426 7.86751C18.6069 7.88319 18.6737 7.88594 18.7391 7.87559C18.8045 7.86525 18.8672 7.84202 18.9236 7.80724C18.9799 7.77247 19.0288 7.72685 19.0674 7.67304C19.106 7.61922 19.1335 7.55828 19.1483 7.49374C19.1631 7.42921 19.165 7.36238 19.1538 7.29711C19.1426 7.23185 19.1185 7.16947 19.083 7.11358C19.0475 7.05769 19.0013 7.00942 18.9469 6.97155C18.8926 6.93369 18.8313 6.90699 18.7666 6.89301L15.4586 6.13301C15.3938 6.11577 15.3261 6.11175 15.2597 6.12119C15.1933 6.13063 15.1294 6.15335 15.072 6.18798C15.0145 6.22261 14.9646 6.26845 14.9252 6.32276C14.8859 6.37708 14.8578 6.43877 14.8428 6.50415C14.8278 6.56953 14.826 6.63726 14.8377 6.70333C14.8494 6.76939 14.8743 6.83242 14.9108 6.88867C14.9474 6.94492 14.9949 6.99324 15.0505 7.03075C15.1061 7.06826 15.1687 7.0942 15.2346 7.10701L18.5426 7.86751Z" fill="currentColor" stroke="currentColor" strokeWidth="0.4" />
    <path fillRule="evenodd" clipRule="evenodd" d="M17.0005 11C18.0614 11 19.0788 10.5786 19.8289 9.82843C20.5791 9.07828 21.0005 8.06087 21.0005 7C21.0005 5.93913 20.5791 4.92172 19.8289 4.17157C19.0788 3.42143 18.0614 3 17.0005 3C15.9396 3 14.9222 3.42143 14.1721 4.17157C13.4219 4.92172 13.0005 5.93913 13.0005 7C13.0005 8.06087 13.4219 9.07828 14.1721 9.82843C14.9222 10.5786 15.9396 11 17.0005 11ZM17.0005 10C17.3945 10 17.7846 9.9224 18.1486 9.77164C18.5125 9.62087 18.8433 9.3999 19.1218 9.12132C19.4004 8.84274 19.6214 8.51203 19.7722 8.14805C19.9229 7.78407 20.0005 7.39397 20.0005 7C20.0005 6.60603 19.9229 6.21593 19.7722 5.85195C19.6214 5.48797 19.4004 5.15726 19.1218 4.87868C18.8433 4.6001 18.5125 4.37913 18.1486 4.22836C17.7846 4.0776 17.3945 4 17.0005 4C16.2049 4 15.4418 4.31607 14.8792 4.87868C14.3166 5.44129 14.0005 6.20435 14.0005 7C14.0005 7.79565 14.3166 8.55871 14.8792 9.12132C15.4418 9.68393 16.2049 10 17.0005 10ZM8.38951 4.6225C8.06601 3.8565 6.98301 3.7795 6.54851 4.491L3.14651 10.0575C2.75401 10.6995 3.19251 11.5195 3.95801 11.574L9.89101 11.997C10.656 12.052 11.213 11.303 10.921 10.612L8.38951 4.6225ZM7.40601 5.0065L7.40151 5.0125L4.00551 10.57L4.00651 10.571L4.01151 10.573C4.01725 10.5753 4.02335 10.5765 4.02951 10.5765L9.96301 10.9995H9.98201C9.98723 10.9978 9.99213 10.9953 9.99651 10.992L7.46851 5.012L7.46651 5.007C7.45836 5.00215 7.449 4.99972 7.43951 5C7.42897 4.99895 7.41833 5.0005 7.40851 5.0045L7.40701 5.005L7.40601 5.0065ZM17.693 18.18C18.4141 17.8438 18.9722 17.2348 19.2443 16.4872C19.5165 15.7395 19.4805 14.9144 19.1443 14.1932C18.808 13.4721 18.1991 12.9141 17.4515 12.6419C16.7038 12.3698 15.8786 12.4058 15.1575 12.742L9.71951 15.277C8.99832 15.6132 8.44024 16.2222 8.16803 16.9699C7.89582 17.7176 7.93179 18.5428 8.26801 19.264C8.60424 19.9852 9.21319 20.5433 9.9609 20.8155C10.7086 21.0877 11.5338 21.0517 12.255 20.7155L17.693 18.18ZM10.142 16.184C9.90136 16.2933 9.68477 16.4493 9.50476 16.6428C9.32474 16.8364 9.18488 17.0637 9.09325 17.3116C9.00162 17.5595 8.96004 17.8231 8.97092 18.0872C8.9818 18.3513 9.04492 18.6107 9.15664 18.8502C9.26835 19.0898 9.42644 19.3048 9.62176 19.4829C9.81709 19.6609 10.0458 19.7985 10.2946 19.8877C10.5434 19.9769 10.8075 20.0158 11.0714 20.0023C11.3354 19.9888 11.5941 19.9231 11.8325 19.809L14.0655 18.7675L12.3755 15.1425L10.142 16.184ZM14.972 18.345L13.2815 14.72L15.58 13.648C15.8186 13.5326 16.0778 13.4657 16.3424 13.4514C16.6071 13.437 16.872 13.4753 17.1217 13.5642C17.3714 13.6531 17.6009 13.7908 17.797 13.9691C17.993 14.1475 18.1516 14.3631 18.2636 14.6033C18.3756 14.8436 18.4388 15.1036 18.4494 15.3685C18.4599 15.6333 18.4178 15.8976 18.3253 16.146C18.2329 16.3944 18.092 16.622 17.9108 16.8155C17.7296 17.0089 17.5118 17.1645 17.27 17.273L14.972 18.345Z" fill="currentColor" stroke="currentColor" strokeWidth="0.4" />
  </svg>
);
export const IconLabTest = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_features_labtest)">
      <path d="M17.25 0.75H5.25M15 5.25H7.5M1.5 12.75H4.5M3 11.25V14.25M15 19.5C15 20.4946 14.6049 21.4484 13.9017 22.1517C13.1984 22.8549 12.2446 23.25 11.25 23.25C10.2554 23.25 9.30161 22.8549 8.59835 22.1517C7.89509 21.4484 7.5 20.4946 7.5 19.5V0.75H15V19.5ZM21 6.75C21.3978 6.75 21.7794 6.59196 22.0607 6.31066C22.342 6.02936 22.5 5.64782 22.5 5.25C22.5 4.85218 22.342 4.47064 22.0607 4.18934C21.7794 3.90804 21.3978 3.75 21 3.75C20.6022 3.75 20.2206 3.90804 19.9393 4.18934C19.658 4.47064 19.5 4.85218 19.5 5.25C19.5 5.64782 19.658 6.02936 19.9393 6.31066C20.2206 6.59196 20.6022 6.75 21 6.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.375 9C12.2755 9 12.1802 8.96049 12.1098 8.89017C12.0395 8.81984 12 8.72446 12 8.625C12 8.52554 12.0395 8.43016 12.1098 8.35983C12.1802 8.28951 12.2755 8.25 12.375 8.25M12.375 9C12.4745 9 12.5698 8.96049 12.6402 8.89017C12.7105 8.81984 12.75 8.72446 12.75 8.625C12.75 8.52554 12.7105 8.43016 12.6402 8.35983C12.5698 8.28951 12.4745 8.25 12.375 8.25M10.125 13.5C10.0255 13.5 9.93016 13.4605 9.85983 13.3902C9.78951 13.3198 9.75 13.2245 9.75 13.125C9.75 13.0255 9.78951 12.9302 9.85983 12.8598C9.93016 12.7895 10.0255 12.75 10.125 12.75M10.125 13.5C10.2245 13.5 10.3198 13.4605 10.3902 13.3902C10.4605 13.3198 10.5 13.2245 10.5 13.125C10.5 13.0255 10.4605 12.9302 10.3902 12.8598C10.3198 12.7895 10.2245 12.75 10.125 12.75M11.625 18C11.5255 18 11.4302 17.9605 11.3598 17.8902C11.2895 17.8198 11.25 17.7245 11.25 17.625C11.25 17.5255 11.2895 17.4302 11.3598 17.3598C11.4302 17.2895 11.5255 17.25 11.625 17.25M11.625 18C11.7245 18 11.8198 17.9605 11.8902 17.8902C11.9605 17.8198 12 17.7245 12 17.625C12 17.5255 11.9605 17.4302 11.8902 17.3598C11.8198 17.2895 11.7245 17.25 11.625 17.25" stroke="currentColor" strokeWidth="1.6" />
    </g>
    <defs>
      <clipPath id="clip0_features_labtest">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export const IconSOS = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M17 15C17.345 15.6 18.258 16 19 16C19.5304 16 20.0391 15.7893 20.4142 15.4142C20.7893 15.0391 21 14.5304 21 14C21 13.4696 20.7893 12.9609 20.4142 12.5858C20.0391 12.2107 19.5304 12 19 12C18.4696 12 17.9609 11.7893 17.5858 11.4142C17.2107 11.0391 17 10.5304 17 10C17 9.46957 17.2107 8.96086 17.5858 8.58579C17.9609 8.21071 18.4696 8 19 8C19.746 8 20.656 8.394 21 9M3 15C3.345 15.6 4.258 16 5 16C5.53043 16 6.03914 15.7893 6.41421 15.4142C6.78929 15.0391 7 14.5304 7 14C7 13.4696 6.78929 12.9609 6.41421 12.5858C6.03914 12.2107 5.53043 12 5 12C4.46957 12 3.96086 11.7893 3.58579 11.4142C3.21071 11.0391 3 10.5304 3 10C3 9.46957 3.21071 8.96086 3.58579 8.58579C3.96086 8.21071 4.46957 8 5 8C5.746 8 6.656 8.394 7 9M12 8C12.5304 8 13.0391 8.21071 13.4142 8.58579C13.7893 8.96086 14 9.46957 14 10V14C14 14.5304 13.7893 15.0391 13.4142 15.4142C13.0391 15.7893 12.5304 16 12 16C11.4696 16 10.9609 15.7893 10.5858 15.4142C10.2107 15.0391 10 14.5304 10 14V10C10 9.46957 10.2107 8.96086 10.5858 8.58579C10.9609 8.21071 11.4696 8 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconDoseManagement = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5.5 15C5.5 14.8674 5.55268 14.7402 5.64645 14.6464C5.74021 14.5527 5.86739 14.5 6 14.5H13C13.1326 14.5 13.2598 14.5527 13.3536 14.6464C13.4473 14.7402 13.5 14.8674 13.5 15C13.5 15.1326 13.4473 15.2598 13.3536 15.3536C13.2598 15.4473 13.1326 15.5 13 15.5H6C5.86739 15.5 5.74021 15.4473 5.64645 15.3536C5.55268 15.2598 5.5 15.1326 5.5 15ZM6 17C5.86739 17 5.74021 17.0527 5.64645 17.1464C5.55268 17.2402 5.5 17.3674 5.5 17.5C5.5 17.6326 5.55268 17.7598 5.64645 17.8536C5.74021 17.9473 5.86739 18 6 18H13C13.1326 18 13.2598 17.9473 13.3536 17.8536C13.4473 17.7598 13.5 17.6326 13.5 17.5C13.5 17.3674 13.4473 17.2402 13.3536 17.1464C13.2598 17.0527 13.1326 17 13 17H6ZM6.25 10.5C6.66421 10.5 7 10.1642 7 9.75V9.5C7 9.22386 7.22386 9 7.5 9C7.77614 9 8 9.22386 8 9.5V9.75C8 10.1642 8.33579 10.5 8.75 10.5H9C9.27614 10.5 9.5 10.7239 9.5 11C9.5 11.2761 9.27614 11.5 9 11.5H8.75C8.33579 11.5 8 11.8358 8 12.25V12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5V12.25C7 11.8358 6.66421 11.5 6.25 11.5H6C5.72386 11.5 5.5 11.2761 5.5 11C5.5 10.7239 5.72386 10.5 6 10.5H6.25Z" fill="currentColor" stroke="currentColor" strokeWidth="0.4" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7.5 3C7.10218 3 6.72064 3.15804 6.43934 3.43934C6.15804 3.72064 6 4.10218 6 4.5H4.5C4.10218 4.5 3.72064 4.65804 3.43934 4.93934C3.15804 5.22064 3 5.60218 3 6V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H14.5C14.8978 21 15.2794 20.842 15.5607 20.5607C15.842 20.2794 16 19.8978 16 19.5V6C16 5.60218 15.842 5.22064 15.5607 4.93934C15.2794 4.65804 14.8978 4.5 14.5 4.5H13C13 4.10218 12.842 3.72064 12.5607 3.43934C12.2794 3.15804 11.8978 3 11.5 3H7.5ZM11.5 6C11.6326 6 11.7598 5.94732 11.8536 5.85355C11.9473 5.75979 12 5.63261 12 5.5V4.5C12 4.36739 11.9473 4.24021 11.8536 4.14645C11.7598 4.05268 11.6326 4 11.5 4H7.5C7.36739 4 7.24021 4.05268 7.14645 4.14645C7.05268 4.24021 7 4.36739 7 4.5V5.5C7 5.63261 7.05268 5.75979 7.14645 5.85355C7.24021 5.94732 7.36739 6 7.5 6H11.5ZM6 5.5C6 5.89782 6.15804 6.27936 6.43934 6.56066C6.72064 6.84196 7.10218 7 7.5 7H11.5C11.8978 7 12.2794 6.84196 12.5607 6.56066C12.842 6.27936 13 5.89782 13 5.5H14.5C14.6326 5.5 14.7598 5.55268 14.8536 5.64645C14.9473 5.74021 15 5.86739 15 6V19.5C15 19.6326 14.9473 19.7598 14.8536 19.8536C14.7598 19.9473 14.6326 20 14.5 20H4.5C4.36739 20 4.24021 19.9473 4.14645 19.8536C4.05268 19.7598 4 19.6326 4 19.5V6C4 5.86739 4.05268 5.74021 4.14645 5.64645C4.24021 5.55268 4.36739 5.5 4.5 5.5H6ZM18 8.5C18 8.10218 18.158 7.72064 18.4393 7.43934C18.7206 7.15804 19.1022 7 19.5 7C19.8978 7 20.2794 7.15804 20.5607 7.43934C20.842 7.72064 21 8.10218 21 8.5V18.6515L19.5 20.9015L18 18.6515V8.5ZM19.5 8C19.3674 8 19.2402 8.05268 19.1464 8.14645C19.0527 8.24021 19 8.36739 19 8.5V9.5H20V8.5C20 8.36739 19.9473 8.24021 19.8536 8.14645C19.7598 8.05268 19.6326 8 19.5 8ZM19.5 19.0985L20 18.3485V10.5H19V18.3485L19.5 19.0985Z" fill="currentColor" stroke="currentColor" strokeWidth="0.4" />
  </svg>
);

// Accent color per tab — each tab binds its OWN Figma color variable (confirmed via
// get_variable_defs per state node), not a single shared color across all tabs.
// Exported so the mobile section (FeaturesSectionMobile) reuses the same copy/colors.
export const TABS = [
  {
    label: 'Doctor',
    Icon: IconDoctor,
    accent: '#30956A', // Green Secondary/10
    accentLight: '#E8FFF1', // Success/light — active border, exact from node 13257:4315
    image: '/assets/features/features-state0-doctor.png',
    boldText: 'Book a doctor in a single tap.',
    bodyText:
      ' Schedule consultations, connect with trusted doctors, receive reminders, and manage appointments from the app or with a single tap on your TakeCare device.',
  },
  {
    label: 'Medicines',
    Icon: IconMedicine,
    accent: '#D29300', // Warning/Dark
    accentLight: '#FFF4DC', // pale tint, same pattern as Success/light
    image: '/assets/features/features-state1-medicines.png',
    boldText: 'Refill your medicines with a single tap.',
    bodyText:
      ' Refill prescriptions, upload prescriptions, track medicine stock, and get expert support—all from the app or with a single tap on your TakeCare device. Our concierge team handles the rest.',
  },
  {
    label: 'Lab tests',
    Icon: IconLabTest,
    accent: '#005D8E', // Blue Secondary/Brand
    accentLight: '#E1F1FA', // pale tint, same pattern as Success/light
    image: '/assets/features/features-state2-labtest.png',
    boldText: 'Book lab tests with a single tap.',
    bodyText:
      ' Browse tests, schedule home sample collection, and receive reports through the app or with a single tap on your TakeCare device. Our concierge team coordinates everything for you.',
  },
  {
    label: 'SOS',
    Icon: IconSOS,
    accent: '#D82525', // Error/Dark
    accentLight: '#FFE9E9', // pale tint, same pattern as Success/light
    image: '/assets/features/features-state3-emergency.png',
    boldText: 'Emergency Services. Get help when every second matters.',
    bodyText:
      ' Trigger emergency assistance, instantly notify caregivers, and connect to support with a single tap on your TakeCare device or through the app.',
  },
  {
    label: 'Dose Management',
    Icon: IconDoseManagement,
    accent: '#008EB1', // Blue Tertiary/10
    accentLight: '#E2F6FC', // pale tint, same pattern as Success/light
    image: '/assets/features/features-state4-dose.png',
    boldText: 'Take the right medicine at the right time.',
    bodyText:
      " Only the scheduled slot glows at the right time. The display shows what's next, sends reminders, and automatically logs each dose when the slot is closed.",
  },
];

// Three animation phases: idle → exiting → entering → idle
// 'activeTab'  — which button is highlighted (updates immediately on click)
// 'displayTab' — which content is rendered (updates after exit animation)
// 'phase'      — drives CSS class on card + description

export default function FeaturesSection() {
  const wrapperRef = useRef(null);
  const canvasRef  = useRef(null);
  const timerRef   = useRef(null);

  const [activeTab,  setActiveTab]  = useState(0);
  const [displayTab, setDisplayTab] = useState(0);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'exiting' | 'entering'

  /* ── Preload all images so swaps never flash ── */
  useEffect(() => {
    TABS.forEach(t => { const img = new Image(); img.src = t.image; });
  }, []);

  /* ── Scale canvas to viewport (width + height constraint) ── */
  useEffect(() => {
    const update = () => {
      if (!canvasRef.current || !wrapperRef.current) return;
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const s  = Math.min(1, vw / CANVAS_W, (vh - 52) / CANVAS_H);
      const ox = (vw - CANVAS_W * s) / 2;
      canvasRef.current.style.transform = `translate(${ox}px, 0) scale(${s})`;
      wrapperRef.current.style.height   = `${CANVAS_H * s}px`;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ── Phase machine: exiting → swap → entering → idle ── */
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (phase === 'exiting') {
      // after exit animation completes, swap content and start enter
      timerRef.current = setTimeout(() => {
        setDisplayTab(activeTab);
        setPhase('entering');
      }, 200); // matches feat-exit duration
    } else if (phase === 'entering') {
      // after enter animation completes, return to idle
      timerRef.current = setTimeout(() => {
        setPhase('idle');
      }, 400); // matches feat-enter duration (spring 400ms)
    }
    return () => clearTimeout(timerRef.current);
  }, [phase, activeTab]);

  /* ── Tab click: highlight button immediately, trigger exit phase ── */
  const switchTab = (i) => {
    if (i === activeTab || phase !== 'idle') return;
    setActiveTab(i);
    setPhase('exiting');
  };

  const animClass = phase === 'exiting' ? 'feat-exiting' : phase === 'entering' ? 'feat-entering' : '';
  const tab = TABS[displayTab];

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative', background: '#f9f9f9', overflow: 'hidden' }}
    >
      <div
        ref={canvasRef}
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: 'top left',
          background: '#f9f9f9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '120px',
          boxSizing: 'border-box',
          gap: '60px',
          overflow: 'hidden',
        }}
      >
        {/* ── Header (static, never animated) ── */}
        <div
          style={{
            width: 660,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32,
            textAlign: 'center',
          }}
        >
          {/* Web/H3-M 24px Medium (node 12335:6551) */}
          <p
            className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{
              fontSize: 24, fontWeight: 500, fontFamily: 'Inter, sans-serif',
              color: '#008eb1', letterSpacing: '0.3888px', lineHeight: 'normal',
              margin: 0, width: '100%',
            }}
          >
            CureBay Services
          </p>
          {/* Web/H0-B 88px Bold (node 12335:6552) */}
          <p
            className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{
              fontSize: 88, fontWeight: 700, fontFamily: 'Inter, sans-serif',
              color: '#000', textShadow: '0px 2px 20px rgba(0,65,114,0.08)',
              lineHeight: 'normal', margin: 0, width: '100%',
            }}
          >
            One device. Complete care.
          </p>
        </div>

        {/* ── Features content (node 12335:1637 — column gap 32) ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 32, width: '100%',
        }}>
          {/* Card — animated via CSS class */}
          <div
            className={animClass}
            style={{ width: 1000, height: 500, flexShrink: 0, overflow: 'hidden' }}
          >
            <img
              src={tab.image}
              alt={tab.label}
              draggable={false}
              style={{ width: 1000, height: 500, objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Tab strip — Figma "Option_CTA" (node 13257:4314): a 6-track grid,
              gap 12, full row width; the last tab (Dose Management) spans 2
              tracks. Buttons: 12px radius, px-16 py-12, 16px Medium text
              (Web/Button, tracking 0.2592), 24px icon, white fill,
              drop-shadow 0 4px 6px rgba(0,65,114,0.08).
              Active: light-tint border + inset 0 0 2 rgba(0,65,114,0.16);
              inactive: Black/3 border, Black/7 text. Figma only draws the
              Doctor tab active (#E8FFF1 border) — the other tabs' active
              tints follow the same pale-tint pattern per accent. */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
              gap: 12,
              width: 1000,
            }}
          >
            {TABS.map((t, i) => {
              const isActive = i === activeTab;
              return (
                <button
                  key={t.label}
                  onClick={() => switchTab(i)}
                  style={{
                    gridColumn: i === 4 ? 'span 2' : 'auto',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderRadius: 12,
                    padding: '12px 16px',
                    background: '#FFFFFF',
                    color: isActive ? t.accent : '#808080',
                    fontSize: 16, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.2592px', lineHeight: 'normal',
                    gap: 8,
                    border: `1px solid ${isActive ? t.accentLight : '#E5E5E5'}`,
                    cursor: 'pointer', whiteSpace: 'nowrap', outline: 'none',
                    filter: 'drop-shadow(0px 4px 6px rgba(0,65,114,0.08))',
                    boxShadow: isActive ? 'inset 0px 0px 2px rgba(0,65,114,0.16)' : 'none',
                    transition: 'color 0.24s ease, border-color 0.24s ease, box-shadow 0.24s ease',
                  }}
                >
                  {t.label}
                  <t.Icon width={24} height={24} />
                </button>
              );
            })}
          </div>

          {/* Description text (node 12333:6416) — 700px block, Web/H4-M
              18px Medium, lh 28, tracking 0.5825; lead sentence in the tab's
              accent, remainder black. Animated with same class as card. */}
          <p
            className={`${animClass} [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]`}
            style={{
              width: 700, textAlign: 'center', fontSize: 0, margin: 0,
            }}
          >
            <span style={{
              fontSize: 18, fontWeight: 500, fontFamily: 'Inter, sans-serif',
              lineHeight: '28px', letterSpacing: '0.5825px', color: tab.accent,
            }}>
              {tab.boldText}
            </span>
            <span style={{
              fontSize: 18, fontWeight: 500, fontFamily: 'Inter, sans-serif',
              lineHeight: '28px', letterSpacing: '0.5825px', color: '#000',
            }}>
              {tab.bodyText}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
