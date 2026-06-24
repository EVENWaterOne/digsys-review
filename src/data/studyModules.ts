export interface StudyModule {
  id: string;
  title: string;
  priority: "S" | "A" | "B" | "C";
  lectureRefs: string[];
  focusRefs: string[];
  questionTags: string[];
  summary: string;
  keyPoints: string[];
  workedExample: string;
  commonTraps: string[];
}

export const studyModules: StudyModule[] = [
  {
    id: "number-representation",
    title: "Number Representation and Two's Complement",
    priority: "A",
    lectureRefs: ["Lecture 01"],
    focusRefs: ["Focus 2.1-2.7", "Focus 24-25"],
    questionTags: ["number-representation", "two-complement", "overflow"],
    summary:
      "Digital systems interpret bit patterns through a chosen representation. The same 8-bit pattern can be unsigned, signed two's-complement, an address, or an instruction field; the hardware stores bits, while the context gives those bits meaning.",
    keyPoints: [
      "Unsigned w-bit values range from 0 to $2^w - 1$; two's-complement values range from $-2^{w-1}$ to $2^{w-1}-1$.",
      "Sign extension preserves a two's-complement value by copying the sign bit into the new high bits.",
      "Fixed-width arithmetic discards bits beyond the word size, so you must distinguish the stored bit pattern from its signed or unsigned interpretation.",
      "Signed overflow occurs when adding two values with the same sign produces a result with the opposite sign.",
    ],
    workedExample:
      "For 8-bit two's-complement, 0x7F is +127. Adding 0x01 gives the bit pattern 0x80. As an unsigned value this is 128, but as an 8-bit signed value it is -128, so signed overflow occurred.",
    commonTraps: [
      "Zero-extending a negative two's-complement value instead of sign-extending it.",
      "Calling every carry-out a signed overflow.",
      "Forgetting that the bit pattern can be correct even when the signed mathematical result is out of range.",
    ],
  },
  {
    id: "logic-kmap",
    title: "Boolean Algebra, K-maps, and Combinational Logic",
    priority: "B",
    lectureRefs: ["Lecture 03", "Lecture 04"],
    focusRefs: ["Focus 4.1-4.8", "Focus 22.3"],
    questionTags: ["boolean-algebra", "k-map", "sop", "lut"],
    summary:
      "Combinational circuits have no memory: their outputs are functions of current inputs only. Boolean algebra and Karnaugh maps are tools for moving between truth tables, expressions, and efficient gate-level implementations.",
    keyPoints: [
      "Canonical SOP is formed by OR-ing the minterms where the output is 1; it is correct but not necessarily minimal.",
      "In a K-map group, variables that change are eliminated and variables that stay constant remain in the product term.",
      "Groups must have sizes that are powers of two, and edge cells are adjacent because K-maps wrap around.",
      "MUXes and decoders can implement Boolean functions by turning input combinations into selected data paths or minterms.",
    ],
    workedExample:
      "If a 3-variable function is 1 on minterms 0, 1, 2, and 3, then A is always 0 while B and C vary. The minimized SOP is therefore $\\overline{A}$.",
    commonTraps: [
      "Using ordinary binary order instead of Gray-code order in K-map rows or columns.",
      "Drawing a group of 3 or 6 cells, which is illegal.",
      "Keeping variables that vary inside a group.",
    ],
  },
  {
    id: "sequential-fsm",
    title: "Sequential Timing and Finite State Machines",
    priority: "A",
    lectureRefs: ["Lecture 05", "Lecture 06"],
    focusRefs: ["Focus 5.1-5.5", "Focus 6.1-6.9"],
    questionTags: ["sequential-logic", "timing", "setup-time", "hold-time", "fsm", "state-encoding", "mealy"],
    summary:
      "Sequential circuits combine storage elements with combinational logic. The state stored in flip-flops explains how the circuit can react differently to the same input at different times.",
    keyPoints: [
      "Setup timing checks the longest register-to-register path: $T_c \\ge t_{pcq} + t_{pd} + t_{setup}$.",
      "Hold timing checks the shortest path: $t_{ccq} + t_{cd} \\ge t_{hold}$.",
      "A binary encoding for K states needs $\\lceil \\log_2 K \\rceil$ flip-flops; one-hot encoding uses one flip-flop per state.",
      "Moore outputs depend only on state; Mealy outputs may depend on both state and current input.",
    ],
    workedExample:
      "A 7-state FSM needs 3 binary state bits because 2 bits encode only 4 states and 3 bits encode 8 states. One encoding can remain unused.",
    commonTraps: [
      "Trying to fix a hold violation by lowering the clock frequency.",
      "Rounding $\\log_2 K$ down instead of up.",
      "Confusing a Mealy transition label with a Moore state output.",
    ],
  },
  {
    id: "alu-memory",
    title: "Adders, ALU Control, Memory Arrays, and LUTs",
    priority: "A",
    lectureRefs: ["Lecture 08"],
    focusRefs: ["Focus 7.1-9.5", "Focus 24-25"],
    questionTags: ["alu", "memory", "capacity", "address-lines", "control-signals"],
    summary:
      "Arithmetic circuits and memory arrays are repeated structures. Exam questions often test whether you can identify the building block, count the required control or address bits, and compute capacity.",
    keyPoints: [
      "A full adder adds A, B, and Cin; ripple-carry adders chain full adders so carry propagates from low to high bits.",
      "Selecting N ALU operations needs $\\lceil \\log_2 N \\rceil$ binary control bits.",
      "N address lines select $2^N$ locations; total memory capacity is depth times data width.",
      "A LUT stores precomputed outputs and can implement a small Boolean function by using inputs as an address.",
    ],
    workedExample:
      "A memory with 10 address lines and 8 bits per location has $2^{10}=1024$ locations, so its capacity is 8192 bits or 1024 bytes.",
    commonTraps: [
      "Multiplying address lines by data width instead of exponentiating the address-line count.",
      "Saying a half adder can accept a carry-in.",
      "Equating a LUT with a cache; a LUT stores a fixed mapping, not recently used data.",
    ],
  },
  {
    id: "gbz80-core",
    title: "GBz80 Registers, Flags, and Code Tracing",
    priority: "S",
    lectureRefs: ["Lecture 07", "Digital Systems Lab"],
    focusRefs: ["Focus 10.1-10.5", "Focus 23"],
    questionTags: ["gbz80", "assembly-tracing", "flags", "comparison", "wrap-around", "code-tracing"],
    summary:
      "GBz80 tracing is the highest-priority skill. You must track registers, flags, memory, and branch decisions line by line, because later instructions often depend on flags set by earlier instructions.",
    keyPoints: [
      "Many ALU instructions use A as the implicit left operand; for example ADD B means A <- A + B.",
      "CP updates flags as if it subtracted, but it does not modify A.",
      "8-bit registers wrap modulo 256, so DEC 0 becomes 0xFF.",
      "ADC includes the previous carry flag, so old flags can change the numeric result.",
    ],
    workedExample:
      "If A=5 and B=10, CP B sets carry because A < B but leaves A=5. If JR C branches and INC A runs, A becomes 6. An ADC B after that computes 6 + 10 + 1 = 17.",
    commonTraps: [
      "Treating CP as SUB and changing A.",
      "Using the wrong instruction's flags for a conditional jump.",
      "Forgetting that INC/DEC and ADD affect different flags in different ways.",
    ],
  },
  {
    id: "gbz80-memory-control",
    title: "GBz80 Memory Access, Control Flow, Cycles, and Optimization",
    priority: "S",
    lectureRefs: ["Lecture 07", "Digital Systems Lab"],
    focusRefs: ["Focus 11.1-16.6"],
    questionTags: [
      "gbz80",
      "stack",
      "call-ret",
      "program-counter",
      "instruction-encoding",
      "immediate-size",
      "cycle-counting",
      "game-boy",
      "vblank",
      "vram",
      "wram",
    ],
    summary:
      "The GBz80 part of the exam often combines code meaning with machine details: labels, pointers, stack behavior, instruction sizes, cycle counts, and Game Boy memory-map restrictions.",
    keyPoints: [
      "JP changes PC without saving a return address; CALL pushes a return address on the stack and RET pops it back.",
      "Labels are symbolic addresses. Brackets mean memory access, so label and [label] are not the same idea.",
      "For cycle counts, count taken and not-taken conditional branches separately, especially on the final loop iteration.",
      "Mutable gameplay variables normally belong in WRAM; VRAM and OAM are graphics-related and have PPU timing restrictions.",
    ],
    workedExample:
      "A loop whose conditional JR is taken 9 times and not taken once has different branch costs for the first 9 iterations and the final exit iteration. You should write the total as setup + repeated body + final body.",
    commonTraps: [
      "Charging the final conditional branch as taken.",
      "Putting ordinary variables in VRAM instead of WRAM.",
      "Assuming all GBz80 instructions have a fixed length.",
    ],
  },
  {
    id: "mips-isa-datapath",
    title: "MIPS ISA, Single-Cycle Datapath, and Control",
    priority: "A",
    lectureRefs: ["Lecture 09", "Lecture 10"],
    focusRefs: ["Focus 17.1-19.4"],
    questionTags: ["mips", "branch-addressing", "instruction-encoding", "single-cycle", "datapath", "lw"],
    summary:
      "MIPS is a regular RISC architecture. The exam focus is less about memorizing syntax and more about understanding instruction formats, register roles, branch addressing, and how data flows through the datapath.",
    keyPoints: [
      "Classic MIPS instructions are fixed 32-bit words, or 4 bytes.",
      "I-type instructions have a 16-bit immediate field; branches use PC+4 plus the sign-extended immediate shifted left by 2.",
      "In a single-cycle implementation, every instruction completes in one long cycle, so the slowest path sets the clock period.",
      "lw is usually the longest common path because it uses instruction memory, register read, ALU address calculation, data memory, and register writeback.",
    ],
    workedExample:
      "A beq at 0x00400020 with immediate 3 targets PC+4+3*4 = 0x00400024+0xC = 0x00400030.",
    commonTraps: [
      "Adding the branch immediate as bytes instead of instruction words.",
      "Forgetting that $0 always reads as zero.",
      "Thinking single-cycle CPI=1 means every instruction is fast; the clock must still fit the slowest instruction.",
    ],
  },
  {
    id: "mips-multicycle-pipeline",
    title: "Multi-Cycle MIPS and Pipelined MIPS",
    priority: "A",
    lectureRefs: ["Lecture 11", "Lecture 12"],
    focusRefs: ["Focus 20.1-21.9"],
    questionTags: ["mips", "multi-cycle", "pipeline", "performance", "load-use", "hazards"],
    summary:
      "Multi-cycle and pipelined processors both split instruction execution into stages, but for different purposes. Multi-cycle designs reuse hardware across time; pipelines overlap different instructions to improve throughput.",
    keyPoints: [
      "Multi-cycle control is an FSM, and different instruction classes take different numbers of cycles.",
      "A five-stage pipeline has IF, ID, EX, MEM, and WB; without hazards, N instructions take N+4 cycles.",
      "Forwarding handles many RAW hazards, but a directly following load-use dependency usually still needs one stall.",
      "Control hazards from taken branches or jumps may require flushing wrongly fetched instructions.",
    ],
    workedExample:
      "Twelve instructions in an ideal 5-stage pipeline take 12+4=16 cycles if there are no stalls or flushes. Add load-use stalls and control flush penalties on top of that baseline.",
    commonTraps: [
      "Counting static code lines instead of dynamically executed instructions.",
      "Assuming forwarding solves a next-instruction load-use hazard.",
      "Confusing lower latency for one instruction with higher throughput for many instructions.",
    ],
  },
];
