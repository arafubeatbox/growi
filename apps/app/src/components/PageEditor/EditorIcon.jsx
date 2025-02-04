/* eslint-disable max-len */
import React from 'react';

import PropTypes from 'prop-types';

const EditorIcon = (props) => {

  switch (props.icon) {
    case 'Bold':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M9.71,21.14V8.86A.84.84,0,0,1,10.59,8h4.46c2.41,0,4.05,1.41,4.05,3.52a3.17,3.17,0,0,1-2.44,3.08v.07a3.39,3.39,0,0,1,3.15,3.47c0,2.48-1.78,4-4.78,4H10.59A.84.84,0,0,1,9.71,21.14ZM14.11,14c2.08,0,3.21-.83,3.21-2.36s-1-2.16-2.67-2.16H11.47V14Zm.66,6.46c2.12,0,3.23-.86,3.23-2.49s-1.15-2.46-3.4-2.46H11.47v4.95Z" />
        </svg>
      );
    case 'Italic':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M18.55,8a.48.48,0,0,1,.45.5.45.45,0,0,1-.39.5H16.75L14.51,21h1.62a.45.45,0,0,1,.46.5.47.47,0,0,1-.54.5h-4.6a.53.53,0,0,1-.47-.5.47.47,0,0,1,.48-.5h2L15.83,9H14a.52.52,0,0,1-.5-.5A.51.51,0,0,1,14,8Z" />
        </svg>
      );
    case 'Strikethrough':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M22.5,14H7.5a.47.47,0,0,0-.5.5.46.46,0,0,0,.5.5h15a.5.5,0,0,0,0-1Z" />
          <path d="M18,17a2.21,2.21,0,0,1,.6,1.88c-.07.51-.53,2.18-3.31,2.18a5.35,5.35,0,0,1-4.21-1.76L11,18.5c-.05-.3-.21-.5-.5-.5s-.45.17-.5.5v1A5.79,5.79,0,0,0,15,22c3.75,0,4.41-2.11,4.53-2.53A3.12,3.12,0,0,0,19.28,17Z" />
          <path d="M12.21,13h1.91c-1.27-.44-2.37-1.52-2.1-2.5.18-.65,1-1.59,3.27-1.59a4.21,4.21,0,0,1,3.44,1.41l.07.37a.55.55,0,1,0,1.08-.19l-.09-.5-.08-.2A6.28,6.28,0,0,0,15,8c-3.11,0-3.95,1.74-4,2.33A2.32,2.32,0,0,0,12.21,13Z" />
        </svg>
      );
    case 'Heading':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M10,21V9.11a.61.61,0,1,1,1.22,0v5.24h7.55V9.11a.59.59,0,0,1,.62-.64.58.58,0,0,1,.61.64V21a.58.58,0,0,1-.61.63.59.59,0,0,1-.62-.63V15.46H11.22V21A.61.61,0,1,1,10,21Z" />
        </svg>
      );
    case 'InlineCode':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M11,19.57a.54.54,0,0,1-.36-.14L7.05,15.79a.49.49,0,0,1,0-.67l4.09-5a.5.5,0,0,1,.71-.07.5.5,0,0,1,.07.7L8.08,15.41l3.31,3.31a.5.5,0,0,1,0,.71A.54.54,0,0,1,11,19.57Z" /><path d="M18.5,20a.51.51,0,0,1-.32-.12.5.5,0,0,1-.07-.7l3.81-4.63-3.36-3.36a.5.5,0,0,1,0-.71.51.51,0,0,1,.71,0L23,14.21a.49.49,0,0,1,0,.67l-4.09,5A.52.52,0,0,1,18.5,20Z" /><path d="M13,21.5a.41.41,0,0,1-.16,0,.5.5,0,0,1-.32-.63l4-12a.5.5,0,0,1,.63-.31.49.49,0,0,1,.32.63l-4,12A.49.49,0,0,1,13,21.5Z" />
        </svg>
      );
    case 'Quote':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M11.5,14h9a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5h-9a.5.5,0,0,1-.5-.5h0A.5.5,0,0,1,11.5,14Z" /><path d="M8.5,9h11a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5H8.5A.5.5,0,0,1,8,9.5H8A.5.5,0,0,1,8.5,9Z" /><path d="M11.5,19h7a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5h-7a.5.5,0,0,1-.5-.5h0A.5.5,0,0,1,11.5,19Z" /><path d="M8,20.5v-8a.5.5,0,0,1,.5-.5h0a.5.5,0,0,1,.5.5v8a.5.5,0,0,1-.5.5h0A.5.5,0,0,1,8,20.5Z" />
        </svg>
      );
    case 'List':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <circle cx="8.5" cy="9.5" r="1" /><circle cx="8.5" cy="14.5" r="1" /><circle cx="8.5" cy="19.5" r="1" /><path d="M11.5,9h10a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5h-10a.5.5,0,0,1-.5-.5h0A.5.5,0,0,1,11.5,9Z" /><path d="M11.5,14h10a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5h-10a.5.5,0,0,1-.5-.5h0A.5.5,0,0,1,11.5,14Z" /><path d="M11.5,19h10a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5h-10a.5.5,0,0,1-.5-.5h0A.5.5,0,0,1,11.5,19Z" />
        </svg>
      );
    case 'NumberedList':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M11.5,9h10a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5h-10a.5.5,0,0,1-.5-.5h0A.5.5,0,0,1,11.5,9Z" /><path d="M11.5,19h10a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5h-10a.5.5,0,0,1-.5-.5h0A.5.5,0,0,1,11.5,19Z" /><path d="M11.5,14h10a.5.5,0,0,1,.5.5h0a.5.5,0,0,1-.5.5h-10a.5.5,0,0,1-.5-.5h0A.5.5,0,0,1,11.5,14Z" /><path d="M7.44,12h.85V8.62L7.58,9h-.1a.24.24,0,0,1-.29-.19.25.25,0,0,1,.19-.3l.83-.41A.77.77,0,0,1,8.5,8h.08a.29.29,0,0,1,.29.27V12H9.6a.27.27,0,1,1,.1.53H7.44a.27.27,0,0,1,0-.53Z" /><path d="M7.61,17.13a.26.26,0,0,1-.26.26h0c-.14,0-.27-.09-.26-.32v-.4a.48.48,0,0,1,.27-.42,1.93,1.93,0,0,1,1-.25,1.3,1.3,0,0,1,1.42,1.15v.22a2.54,2.54,0,0,1-1,1.74l-1,.94H9.58a.27.27,0,0,1,0,.53H7.32A.32.32,0,0,1,7,20.26v0a.47.47,0,0,1,.2-.34l1.2-1.17a2.12,2.12,0,0,0,.79-1.36.8.8,0,0,0-.75-.85H8.35a1.32,1.32,0,0,0-.7.2Z" />
        </svg>
      );
    case 'CheckList':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M20.5,12.5a.57.57,0,0,1,.5.5v8a1.17,1.17,0,0,1-1,1H10a1.28,1.28,0,0,1-1-1V11a1.28,1.28,0,0,1,1-1h6a.57.57,0,0,1,.5.5.57.57,0,0,1-.5.5H10V21H20V13A.58.58,0,0,1,20.5,12.5ZM12,15.25a.41.41,0,0,0,0,.58L14,18a.78.78,0,0,0,1,0l5.9-9c.09-.16.09-.5-.16-.58a.41.41,0,0,0-.58.08L14.5,17.16l-1.91-1.91A.41.41,0,0,0,12,15.25Z" />
        </svg>
      );
    case 'Link':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M12.12,18a.29.29,0,0,0,.43,0l5.3-5.3c.07-.08.3-.25.06-.51a.32.32,0,0,0-.53,0l-5.22,5.28C12.09,17.57,11.85,17.73,12.12,18Zm2.34-.9a1.74,1.74,0,0,1,0,1,3.69,3.69,0,0,1-.43.78L12.2,20.5a1.69,1.69,0,0,1-1.31.61A1.77,1.77,0,0,1,9.5,20.5a1.65,1.65,0,0,1-.61-1.31A1.74,1.74,0,0,1,9.5,17.8L11.15,16a1.74,1.74,0,0,1,1.92-.43l.69-.7a2.67,2.67,0,0,0-1.21-.26,2.89,2.89,0,0,0-2,.78L8.89,17.19a2.8,2.8,0,0,0-.09,3.92l0,0a2.62,2.62,0,0,0,2.05.83,2.79,2.79,0,0,0,2-.87l1.74-1.66A3.93,3.93,0,0,0,15.42,18a2.56,2.56,0,0,0-.26-1.56Zm6.61-8.18a2.11,2.11,0,0,0-.87-.69,2.69,2.69,0,0,0-3,.69l-1.83,1.66a2.68,2.68,0,0,0-.78,1.56,2.72,2.72,0,0,0,.26,1.66l.69-.7a2,2,0,0,1,0-1,2,2,0,0,1,.44-1l1.83-1.66L18,9.27l.35-.17.34-.18h.44a1.67,1.67,0,0,1,1.3.61,1.74,1.74,0,0,1,.61,1.4,1.62,1.62,0,0,1-.61,1.3l-1.74,1.83-.6.35a1.37,1.37,0,0,1-.79.17H17l-.69.7a8.58,8.58,0,0,0,1,.22,2.9,2.9,0,0,0,1.21-.22l.87-.61,1.74-1.83a2.6,2.6,0,0,0,.23-3.69Z" />
        </svg>
      );
    case 'Image':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M22,8H8A1,1,0,0,0,7,9V21a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V9A1,1,0,0,0,22,8Zm0,13H8V18l4.07-4.06,4.07,4a.41.41,0,0,0,.33.18.4.4,0,0,0,.32-.18l1.7-1.55,3.17,3.25L22,20Zm0-2.25-3.1-3.34a.89.89,0,0,0-.33-.17.89.89,0,0,0-.28.14l-1.83,1.49-4-3.9a.49.49,0,0,0-.32-.16.5.5,0,0,0-.41.16L8,16.75V9H22ZM19.5,12.5a1,1,0,1,1-1-1A1,1,0,0,1,19.5,12.5Z" />
        </svg>
      );
    case 'Grid':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
          <rect width="30" height="30" fill="none" />
          <g transform="translate(-375 -415)">
            <g transform="translate(382 422)">
              <path d="M5,7H1A.945.945,0,0,1,0,6V1A.945.945,0,0,1,1,0H5A.945.945,0,0,1,6,1V6A.945.945,0,0,1,5,7ZM1,1V6H5V1ZM1,.5V1H1Z" />
            </g>
            <g transform="translate(390 422)">
              <path d="M7,7H1A.945.945,0,0,1,0,6V1A.945.945,0,0,1,1,0H7A.945.945,0,0,1,8,1V6A.945.945,0,0,1,7,7ZM1,1V6H7V1ZM1,.5V1H1Z" />
            </g>
            <g transform="translate(382 431)">
              <path d="M9,7H1A.945.945,0,0,1,0,6V1A.945.945,0,0,1,1,0H9a.945.945,0,0,1,1,1V6A.945.945,0,0,1,9,7ZM1,1V6H9V1ZM1,.5V1H1Z" />
            </g>
            <g transform="translate(394 431)">
              <path d="M3,7H1A.945.945,0,0,1,0,6V1A.945.945,0,0,1,1,0H3A.945.945,0,0,1,4,1V6A.945.945,0,0,1,3,7ZM1,1V6H3V1ZM1,.5V1H1Z" />
            </g>
          </g>
        </svg>
      );
    case 'Table':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M8,22a1,1,0,0,1-1-1V9A1,1,0,0,1,8,8H22c1,0,1,.47,1,1V21a1,1,0,0,1-1,1Zm10-4v3h4V18Zm-5,0v3h4V18ZM8,18v3h4V18Zm10-4v3h4V14Zm-5,0v3h4V14ZM8,14v3h4V14Zm10-4v3h4V10Zm-5,0v3h4V10ZM8,10v3h4V10Z" />
        </svg>
      );
    case 'Drawio':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M22.12,17H19.75l-3.12-4H18a1,1,0,0,0,1-1V8a1,1,0,0,0-1-1H12a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1h1.38l-2.92,4H7.88A.94.94,0,0,0,7,18v4a.94.94,0,0,0,.88,1h5.24A.94.94,0,0,0,14,22V18a.94.94,0,0,0-.88-1H11.63l3.13-4h.47l3.13,4H16.88A.94.94,0,0,0,16,18v4a.94.94,0,0,0,.88,1h5.24A.94.94,0,0,0,23,22V18A.94.94,0,0,0,22.12,17ZM13,22H8V18h5ZM12,8h6v4H12ZM22,22H17V18h5Z" />
        </svg>
      );
    case 'Attachment':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 30 30">
          <rect fillOpacity="0" width="30" height="30" />
          <path d="M9.71,22.5a2.57,2.57,0,0,1-1.85-.79,2.79,2.79,0,0,1,0-4l9-9.23a3.21,3.21,0,0,1,1.59-.87,3.39,3.39,0,0,1,1.81.1,4.38,4.38,0,0,1,1.7,1.05,4.15,4.15,0,0,1,.46.56,3.73,3.73,0,0,1,.35.65,4.25,4.25,0,0,1,.2.72,3.91,3.91,0,0,1,.07.76,3.71,3.71,0,0,1-1.12,2.67l-6.79,7a.48.48,0,0,1-.34.16.51.51,0,0,1-.35-.13.48.48,0,0,1,0-.7l6.78-7a2.8,2.8,0,0,0,.84-2,2.58,2.58,0,0,0-.79-2,3.63,3.63,0,0,0-1.11-.75,2.41,2.41,0,0,0-1.31-.17,2.19,2.19,0,0,0-1.25.62l-9,9.22A1.8,1.8,0,0,0,8,19.69,1.78,1.78,0,0,0,8.58,21a1.81,1.81,0,0,0,.57.39,1.48,1.48,0,0,0,.66.1,2,2,0,0,0,1.28-.62l7.12-7.35.15-.16a1.15,1.15,0,0,0,.15-.2.9.9,0,0,0,.12-.24,1.17,1.17,0,0,0,.07-.25.52.52,0,0,0-.05-.27.75.75,0,0,0-.19-.26.73.73,0,0,0-.58-.27,1.29,1.29,0,0,0-.67.38l-5.36,5.53a.5.5,0,0,1-.22.13.46.46,0,0,1-.26,0,.48.48,0,0,1-.22-.12A.41.41,0,0,1,11,17.5a.5.5,0,0,1,.14-.35L16.5,11.6a2.19,2.19,0,0,1,1.29-.67,1.69,1.69,0,0,1,1.37.55,1.54,1.54,0,0,1,.53,1.31,2.26,2.26,0,0,1-.76,1.42L11.8,21.58a3.06,3.06,0,0,1-2,.91H9.71Z" />
        </svg>
      );
    case 'Emoji':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
          <g transform="translate(-435 -392)">
            <rect width="30" height="30" transform="translate(435 392)" fillOpacity="0" />
            <path d="M8,1a7,7,0,1,0,7,7A7.008,7.008,0,0,0,8,1M8,0A8,8,0,1,1,0,8,8,8,0,0,1,8,0Z" transform="translate(442 399)" />
            <circle cx="1" cy="1" r="1" transform="translate(446 403)" />
            <circle cx="1" cy="1" r="1" transform="translate(452 403)" />
            <g transform="translate(445 406.5)">
              <path d="M5,5.5a5.006,5.006,0,0,1-5-5,.5.5,0,1,1,1,0,4,4,0,0,0,8,0,.5.5,0,0,1,1,0A5.006,5.006,0,0,1,5,5.5Z" />
            </g>
          </g>
        </svg>
      );
    case 'Template':
      // TODO: fix
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-filetype-md" viewBox="-2 -3 28 21">
          <path fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2H9v-1h3a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM.706 13.189v2.66H0V11.85h.806l1.14 2.596h.026l1.14-2.596h.8v3.999h-.716v-2.66h-.038l-.946 2.159h-.516l-.952-2.16H.706Zm3.919 2.66V11.85h1.459c.406 0 .741.078 1.005.234.263.157.46.383.589.68.13.297.196.655.196 1.075 0 .422-.066.784-.196 1.084-.131.301-.33.53-.595.689-.264.158-.597.237-1 .237H4.626Zm1.353-3.354h-.562v2.707h.562c.186 0 .347-.028.484-.082a.8.8 0 0 0 .334-.252 1.14 1.14 0 0 0 .196-.422c.045-.168.067-.365.067-.592a2.1 2.1 0 0 0-.117-.753.89.89 0 0 0-.354-.454c-.159-.102-.362-.152-.61-.152Z"/>
        </svg>
      );
  }


};

EditorIcon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default EditorIcon;
