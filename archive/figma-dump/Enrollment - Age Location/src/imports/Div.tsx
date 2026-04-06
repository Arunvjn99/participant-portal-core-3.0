import imgImg from "figma:asset/6c33ba1b228b5ca4211f1ea1d3e2b4e1ffa3e19f.png";

function Img() {
  return (
    <div className="absolute left-[8px] pointer-events-none size-[32px] top-[8px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImg} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0" />
    </div>
  );
}

export default function Div() {
  return (
    <div className="bg-white border-0 border-[#e5e7eb] border-solid relative rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] size-full" data-name="div">
      <Img />
    </div>
  );
}