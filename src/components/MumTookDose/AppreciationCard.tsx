import { useState } from 'react';
import clapImg from '../../assets/mumdose-clap.svg';
import { useContent } from '../../context/ContentContext';

const HOVER_GRADIENT =
  'radial-gradient(ellipse at 50% 50%, #c1008a 2%, #911084 26.5%, #61217e 51%, #48297b 63.2%, #303178 75.5%, #183975 87.7%, #0c3d74 93.9%, #004172 100%)';

export default function AppreciationCard() {
  const { mumTookDose, images } = useContent();
  const { appreciationCard } = mumTookDose;
  const [hovered, setHovered] = useState(false);
  const [appreciated, setAppreciated] = useState(false);

  const handleClick = () => {
    setAppreciated(true);
    setHovered(false);
  };

  return (
    <div
      className="relative flex flex-col gap-[30.284px] p-[30.284px] rounded-[40px] w-[400px] bg-white"
      style={{
        boxShadow:
          '0px 2.524px 12.618px rgba(0,65,114,0.08), inset 0px 0px 2.524px 0px rgba(0,65,114,0.12)',
      }}
    >
      {/* App header: pill box + "Take Care" + timestamp */}
      <div className="flex gap-[15px] items-center w-full">
        <div className="relative shrink-0 w-[60px] h-[60px]">
          <img
            src={images['mumdose-pillbox']}
            alt="TakeCare pill box"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col gap-[15px] flex-1 min-w-0">
          <p
            className="font-bold text-[22.7px] whitespace-nowrap tracking-[0.735px] leading-[35px] text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #3CBA84 0%, #004172 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            {appreciationCard.brand_name}
          </p>
          <p className="font-semibold text-[#4d4d4d] text-[15px] tracking-[0.3px] leading-[1.5]">
            {appreciationCard.timestamp_label}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#e5e5e5]" />

      {/* Notification body */}
      <div className="flex flex-col gap-[15px] w-full">
        <p className="font-bold text-[20px] text-black tracking-[0.654px] leading-[35px] w-full">
          {appreciationCard.notification_title}
        </p>
        <p className="font-medium text-[#4d4d4d] text-[15px] tracking-[0.49px] leading-[25px] w-full whitespace-pre-wrap">
          {`${appreciationCard.notification_slot}  ${appreciationCard.notification_medicine}  ${appreciationCard.notification_status}`}
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#e5e5e5]" />

      {/* Appreciate button — box-shadow (not filter) so overflow-hidden clips correctly */}
      <div
        className="relative flex gap-[10px] h-[60px] items-center justify-center px-5 rounded-[20px] w-full cursor-pointer overflow-hidden"
        style={{ boxShadow: '0px 2.524px 2.524px rgba(0,65,114,0.08)' }}
        onMouseEnter={() => !appreciated && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Base: solid brand-blue — always visible */}
        <div className="absolute inset-0 bg-[#004172]" />

        {/* Hover gradient: pink center → blue edge */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: HOVER_GRADIENT,
            opacity: hovered && !appreciated ? 1 : 0,
          }}
        />

        {/* Appreciated/clicked state: solid pink (Figma State=5 = #c1008a) */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: appreciated ? 1 : 0,
            background: '#c1008a',
          }}
        />

        {/* Clap icon */}
        <div className="relative z-10 shrink-0 w-[30px] h-[30px] overflow-hidden">
          <div className="absolute" style={{ inset: '2.5% 9.95% 6.02% 13.95%' }}>
            <img src={clapImg} alt="" className="absolute block inset-0 w-full h-full" />
          </div>
        </div>

        {/* Label */}
        <p className="relative z-10 font-medium text-white text-[20px] tracking-[0.327px] whitespace-nowrap">
          {appreciationCard.button_label}
        </p>

        {/* Inner shadow */}
        <div className="absolute inset-0 pointer-events-none rounded-[20px] shadow-[inset_0px_0px_2.524px_0px_rgba(0,65,114,0.08)]" />
      </div>
    </div>
  );
}
