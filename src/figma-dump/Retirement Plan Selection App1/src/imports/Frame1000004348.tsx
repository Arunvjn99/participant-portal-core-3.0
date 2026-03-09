function Frame13() {
  return (
    <div className="content-stretch flex items-start justify-between not-italic relative shrink-0 text-[14px] w-full whitespace-nowrap">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#2c2c2f]">Your Funding Plan Report</p>
      <div className="content-stretch flex gap-[5px] items-center justify-center leading-[0] relative rounded-[4px] shrink-0 text-[#01607f]" data-name="Buttons">
        <div className="capitalize flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-center">
          <p className="[text-decoration-skip-ink:none] decoration-solid leading-[20px] underline">View details</p>
        </div>
        <div className="flex flex-col font-['Font_Awesome_6_Pro:Regular',sans-serif] justify-center relative shrink-0 tracking-[0.28px]">
          <p className="leading-[normal]">chevron-right</p>
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center relative rounded-[17px] shrink-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#393a41] text-[14px] whitespace-nowrap">Expected</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#30313b] text-[14px] whitespace-nowrap">$20,000</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative rounded-[5px]">
      <Frame8 />
      <Frame7 />
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="bg-[#6725ed] col-1 ml-[12.29px] mt-0 rounded-[6.145px] row-1 size-[9.453px]" />
      <div className="bg-[#d6df55] col-1 ml-[6.56px] mt-0 rounded-[6.145px] row-1 size-[9.453px]" />
      <div className="bg-[#24c9b2] col-1 ml-0 mt-0 rounded-[6.145px] row-1 size-[9.453px]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[19.74px]">
      <Group />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0">
      <Frame />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#30313b] text-[14px] whitespace-nowrap">All income</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#30313b] text-[14px] whitespace-nowrap">$10,000</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative rounded-[5px]">
      <Frame3 />
      <Frame9 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0">
      <div className="bg-[#f14343] rounded-[9px] shrink-0 size-[9.45px]" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#30313b] text-[14px] whitespace-nowrap">Shortfall</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#9c2227] text-[14px] whitespace-nowrap">$10,000</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative rounded-[5px]">
      <Frame4 />
      <Frame10 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Frame2 />
      <div className="h-[25.683px] relative shrink-0 w-0">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 25.6833">
            <path d="M0.5 0V25.6833" id="Vector 1120" stroke="var(--stroke-0, #DBDBDB)" />
          </svg>
        </div>
      </div>
      <Frame5 />
      <div className="h-[25.683px] relative shrink-0 w-0">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 25.6833">
            <path d="M0.5 0V25.6833" id="Vector 1120" stroke="var(--stroke-0, #DBDBDB)" />
          </svg>
        </div>
      </div>
      <Frame6 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-white relative rounded-[5px] shrink-0 w-full">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start justify-center p-[12px] relative w-full">
          <Frame13 />
          <Frame12 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d6d6d6] border-solid inset-0 pointer-events-none rounded-[5px]" />
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full">
      <Frame11 />
    </div>
  );
}