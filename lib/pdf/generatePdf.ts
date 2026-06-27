"use client";

export async function generateReportPdf(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  // Hide non-printable elements (like the download button itself)
  const noPrintElements = element.querySelectorAll(".no-print");
  noPrintElements.forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  // Temporarily strip gradients that break html2canvas in Tailwind v4
  const gradientElements = Array.from(element.querySelectorAll('*')).filter(el => 
    Array.from(el.classList).some(c => c.startsWith('bg-gradient') || c.includes('gradient-text'))
  );
  
  // Also check the root element itself!
  if (Array.from(element.classList).some(c => c.startsWith('bg-gradient') || c.includes('gradient-text'))) {
    gradientElements.push(element);
  }
  
  const originalClasses = new Map();
  gradientElements.forEach(el => {
    originalClasses.set(el, el.className);
    // Remove bg-gradient classes and color stops
    const safeClasses = Array.from(el.classList).filter(c => 
      !c.startsWith('bg-gradient') && !c.startsWith('from-') && !c.startsWith('via-') && !c.startsWith('to-') && !c.includes('gradient-text')
    );
    
    // Add safe fallbacks
    if (Array.from(el.classList).some(c => c.startsWith('bg-gradient'))) {
      safeClasses.push('bg-[#FDFCF8]');
    } else if (Array.from(el.classList).some(c => c.includes('gradient-text'))) {
      safeClasses.push('text-[#75070C]');
    }
    
    el.className = safeClasses.join(' ');
  });

  try {
    // Dynamically import html2pdf.js only when requested
    // @ts-ignore
    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 10,
      filename: `${filename}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
    };

    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("PDF Generation Error:", error);
  } finally {
    // Restore non-printable elements
    noPrintElements.forEach((el) => {
      (el as HTMLElement).style.display = "";
    });
    
    // Restore gradients
    gradientElements.forEach(el => {
      if (originalClasses.has(el)) {
        el.className = originalClasses.get(el);
      }
    });
  }
}
