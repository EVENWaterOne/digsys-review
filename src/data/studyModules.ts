export interface StudyModule {
  id: string;
  title: string;
  titleZh: string;
  priority: "S" | "A" | "B" | "C";
  lectureRefs: string[];
  focusRefs: string[];
  questionTags: string[];
  summary: string;
  summaryZh: string;
  keyPoints: string[];
  keyPointsZh: string[];
  workedExample: string;
  workedExampleZh: string;
  commonTraps: string[];
  commonTrapsZh: string[];
}

export const studyModules: StudyModule[] = [
  {
    id: "number-representation",
    title: "Number Representation and Two's Complement",
    titleZh: "数值表示与二进制补码",
    priority: "A",
    lectureRefs: ["Lecture 01"],
    focusRefs: ["Focus 2.1-2.7", "Focus 24-25"],
    questionTags: ["number-representation", "two-complement", "overflow"],
    summary:
      "Digital systems interpret bit patterns through a chosen representation. The same 8-bit pattern can be unsigned, signed two's-complement, an address, or an instruction field; the hardware stores bits, while the context gives those bits meaning.",
    summaryZh:
      "数字系统会通过某种约定好的表示方式来解释位模式。同一个 8 位模式可以表示无符号数、有符号二进制补码、地址或指令字段；硬件只保存 bit，而上下文决定这些 bit 的含义。",
    keyPoints: [
      "Unsigned w-bit values range from 0 to $2^w - 1$; two's-complement values range from $-2^{w-1}$ to $2^{w-1}-1$.",
      "Sign extension preserves a two's-complement value by copying the sign bit into the new high bits.",
      "Fixed-width arithmetic discards bits beyond the word size, so you must distinguish the stored bit pattern from its signed or unsigned interpretation.",
      "Signed overflow occurs when adding two values with the same sign produces a result with the opposite sign.",
    ],
    keyPointsZh: [
      "w 位无符号数范围是 0 到 $2^w - 1$；二进制补码范围是 $-2^{w-1}$ 到 $2^{w-1}-1$。",
      "符号扩展通过把原来的符号位复制到新增高位，从而保持二进制补码数值不变。",
      "固定字宽运算会丢弃超出字宽的高位，所以要区分实际保存的位模式和它的有符号/无符号解释。",
      "两个同号数相加却得到异号结果时，发生 signed overflow。",
    ],
    workedExample:
      "For 8-bit two's-complement, 0x7F is +127. Adding 0x01 gives the bit pattern 0x80. As an unsigned value this is 128, but as an 8-bit signed value it is -128, so signed overflow occurred.",
    workedExampleZh:
      "在 8 位二进制补码中，0x7F 表示 +127。加上 0x01 后得到位模式 0x80。按无符号数解释它是 128，但按 8 位有符号数解释它是 -128，因此发生了 signed overflow。",
    commonTraps: [
      "Zero-extending a negative two's-complement value instead of sign-extending it.",
      "Calling every carry-out a signed overflow.",
      "Forgetting that the bit pattern can be correct even when the signed mathematical result is out of range.",
    ],
    commonTrapsZh: [
      "把负的二进制补码数做零扩展，而不是符号扩展。",
      "把所有 carry-out 都叫作 signed overflow。",
      "忘记即使数学上的有符号结果越界，硬件保存下来的位模式仍然可能是正确的截断结果。",
    ],
  },
  {
    id: "logic-kmap",
    title: "Boolean Algebra, K-maps, and Combinational Logic",
    titleZh: "布尔代数、K-map 与组合逻辑",
    priority: "B",
    lectureRefs: ["Lecture 03", "Lecture 04"],
    focusRefs: ["Focus 4.1-4.8", "Focus 22.3"],
    questionTags: ["boolean-algebra", "k-map", "sop", "lut"],
    summary:
      "Combinational circuits have no memory: their outputs are functions of current inputs only. Boolean algebra and Karnaugh maps are tools for moving between truth tables, expressions, and efficient gate-level implementations.",
    summaryZh:
      "组合电路没有记忆：输出只由当前输入决定。布尔代数和 Karnaugh map 是在真值表、逻辑表达式和高效门级实现之间转换的工具。",
    keyPoints: [
      "Canonical SOP is formed by OR-ing the minterms where the output is 1; it is correct but not necessarily minimal.",
      "In a K-map group, variables that change are eliminated and variables that stay constant remain in the product term.",
      "Groups must have sizes that are powers of two, and edge cells are adjacent because K-maps wrap around.",
      "MUXes and decoders can implement Boolean functions by turning input combinations into selected data paths or minterms.",
    ],
    keyPointsZh: [
      "Canonical SOP 是把所有输出为 1 的 minterm 用 OR 连起来；它一定正确，但不一定最简。",
      "在 K-map 的一个圈中，会变化的变量被消去，保持不变的变量保留在 product term 里。",
      "圈的大小必须是 2 的幂；K-map 边缘可以环绕相邻，所以边界格也可能相邻。",
      "MUX 和 decoder 可以通过选择数据路径或生成 minterm 来实现布尔函数。",
    ],
    workedExample:
      "If a 3-variable function is 1 on minterms 0, 1, 2, and 3, then A is always 0 while B and C vary. The minimized SOP is therefore $\\overline{A}$.",
    workedExampleZh:
      "如果一个 3 变量函数在 minterm 0、1、2、3 上为 1，那么这些格子里 A 始终为 0，而 B 和 C 会变化。因此最简 SOP 是 $\\overline{A}$。",
    commonTraps: [
      "Using ordinary binary order instead of Gray-code order in K-map rows or columns.",
      "Drawing a group of 3 or 6 cells, which is illegal.",
      "Keeping variables that vary inside a group.",
    ],
    commonTrapsZh: [
      "在 K-map 行列中使用普通二进制顺序，而不是 Gray code 顺序。",
      "画出 3 格或 6 格这样的非法圈。",
      "把圈内会变化的变量错误地保留下来。",
    ],
  },
  {
    id: "sequential-fsm",
    title: "Sequential Timing and Finite State Machines",
    titleZh: "时序约束与有限状态机",
    priority: "A",
    lectureRefs: ["Lecture 05", "Lecture 06"],
    focusRefs: ["Focus 5.1-5.5", "Focus 6.1-6.9"],
    questionTags: ["sequential-logic", "timing", "setup-time", "hold-time", "fsm", "state-encoding", "mealy"],
    summary:
      "Sequential circuits combine storage elements with combinational logic. The state stored in flip-flops explains how the circuit can react differently to the same input at different times.",
    summaryZh:
      "时序电路把存储元件和组合逻辑结合起来。Flip-flop 中保存的 state 解释了为什么同一个输入在不同时间可能让电路产生不同反应。",
    keyPoints: [
      "Setup timing checks the longest register-to-register path: $T_c \\ge t_{pcq} + t_{pd} + t_{setup}$.",
      "Hold timing checks the shortest path: $t_{ccq} + t_{cd} \\ge t_{hold}$.",
      "A binary encoding for K states needs $\\lceil \\log_2 K \\rceil$ flip-flops; one-hot encoding uses one flip-flop per state.",
      "Moore outputs depend only on state; Mealy outputs may depend on both state and current input.",
    ],
    keyPointsZh: [
      "Setup timing 检查最长的 register-to-register 路径：$T_c \\ge t_{pcq} + t_{pd} + t_{setup}$。",
      "Hold timing 检查最短路径：$t_{ccq} + t_{cd} \\ge t_{hold}$。",
      "K 个状态的 binary encoding 需要 $\\lceil \\log_2 K \\rceil$ 个 flip-flop；one-hot encoding 每个状态用一个 flip-flop。",
      "Moore 输出只依赖当前 state；Mealy 输出可以同时依赖当前 state 和当前 input。",
    ],
    workedExample:
      "A 7-state FSM needs 3 binary state bits because 2 bits encode only 4 states and 3 bits encode 8 states. One encoding can remain unused.",
    workedExampleZh:
      "一个 7 状态 FSM 需要 3 个 binary state bits，因为 2 位只能编码 4 个状态，而 3 位可以编码 8 个状态。多出来的一个编码可以不用。",
    commonTraps: [
      "Trying to fix a hold violation by lowering the clock frequency.",
      "Rounding $\\log_2 K$ down instead of up.",
      "Confusing a Mealy transition label with a Moore state output.",
    ],
    commonTrapsZh: [
      "试图通过降低时钟频率来修复 hold violation。",
      "把 $\\log_2 K$ 向下取整，而不是向上取整。",
      "把 Mealy transition label 和 Moore state output 混淆。",
    ],
  },
  {
    id: "alu-memory",
    title: "Adders, ALU Control, Memory Arrays, and LUTs",
    titleZh: "加法器、ALU 控制、存储阵列与 LUT",
    priority: "A",
    lectureRefs: ["Lecture 08"],
    focusRefs: ["Focus 7.1-9.5", "Focus 24-25"],
    questionTags: ["alu", "memory", "capacity", "address-lines", "control-signals"],
    summary:
      "Arithmetic circuits and memory arrays are repeated structures. Exam questions often test whether you can identify the building block, count the required control or address bits, and compute capacity.",
    summaryZh:
      "算术电路和存储阵列都由重复结构构成。考试常考你能否识别基本模块、计算所需控制位或地址位，并算出容量。",
    keyPoints: [
      "A full adder adds A, B, and Cin; ripple-carry adders chain full adders so carry propagates from low to high bits.",
      "Selecting N ALU operations needs $\\lceil \\log_2 N \\rceil$ binary control bits.",
      "N address lines select $2^N$ locations; total memory capacity is depth times data width.",
      "A LUT stores precomputed outputs and can implement a small Boolean function by using inputs as an address.",
    ],
    keyPointsZh: [
      "Full adder 会把 A、B 和 Cin 相加；ripple-carry adder 把多个 full adder 串联，让 carry 从低位传到高位。",
      "选择 N 种 ALU operation 需要 $\\lceil \\log_2 N \\rceil$ 个 binary control bits。",
      "N 根 address lines 可以选择 $2^N$ 个位置；总存储容量等于 depth 乘以 data width。",
      "LUT 存储预先计算好的输出，可以把输入当作地址来实现小规模布尔函数。",
    ],
    workedExample:
      "A memory with 10 address lines and 8 bits per location has $2^{10}=1024$ locations, so its capacity is 8192 bits or 1024 bytes.",
    workedExampleZh:
      "一个有 10 根 address lines、每个位置 8 bit 的 memory 有 $2^{10}=1024$ 个位置，因此容量是 8192 bits，也就是 1024 bytes。",
    commonTraps: [
      "Multiplying address lines by data width instead of exponentiating the address-line count.",
      "Saying a half adder can accept a carry-in.",
      "Equating a LUT with a cache; a LUT stores a fixed mapping, not recently used data.",
    ],
    commonTrapsZh: [
      "用 address lines 数量乘以 data width，而不是先对 address lines 数量取指数。",
      "误以为 half adder 可以接收 carry-in。",
      "把 LUT 和 cache 混为一谈；LUT 存的是固定映射，不是最近访问的数据。",
    ],
  },
  {
    id: "gbz80-core",
    title: "GBz80 Registers, Flags, and Code Tracing",
    titleZh: "GBz80 寄存器、标志位与代码追踪",
    priority: "S",
    lectureRefs: ["Lecture 07", "Digital Systems Lab"],
    focusRefs: ["Focus 10.1-10.5", "Focus 23"],
    questionTags: ["gbz80", "assembly-tracing", "flags", "comparison", "wrap-around", "code-tracing"],
    summary:
      "GBz80 tracing is the highest-priority skill. You must track registers, flags, memory, and branch decisions line by line, because later instructions often depend on flags set by earlier instructions.",
    summaryZh:
      "GBz80 tracing 是最高优先级能力。你必须逐行跟踪 registers、flags、memory 和 branch decisions，因为后面的指令经常依赖前面指令设置的 flags。",
    keyPoints: [
      "Many ALU instructions use A as the implicit left operand; for example ADD B means A <- A + B.",
      "CP updates flags as if it subtracted, but it does not modify A.",
      "8-bit registers wrap modulo 256, so DEC 0 becomes 0xFF.",
      "ADC includes the previous carry flag, so old flags can change the numeric result.",
    ],
    keyPointsZh: [
      "许多 ALU 指令默认把 A 当作左操作数；例如 ADD B 表示 A <- A + B。",
      "CP 会像做减法一样更新 flags，但不会修改 A。",
      "8-bit registers 按 modulo 256 回绕，所以 DEC 0 会得到 0xFF。",
      "ADC 会加上之前的 carry flag，因此旧 flags 可能改变最终数值结果。",
    ],
    workedExample:
      "If A=5 and B=10, CP B sets carry because A < B but leaves A=5. If JR C branches and INC A runs, A becomes 6. An ADC B after that computes 6 + 10 + 1 = 17.",
    workedExampleZh:
      "如果 A=5、B=10，CP B 因为 A < B 会设置 carry，但 A 仍然是 5。如果 JR C 跳转并执行 INC A，A 会变成 6。之后 ADC B 会计算 6 + 10 + 1 = 17。",
    commonTraps: [
      "Treating CP as SUB and changing A.",
      "Using the wrong instruction's flags for a conditional jump.",
      "Forgetting that INC/DEC and ADD affect different flags in different ways.",
    ],
    commonTrapsZh: [
      "把 CP 当作 SUB，错误地修改 A。",
      "条件跳转时使用了错误指令产生的 flags。",
      "忘记 INC/DEC 和 ADD 对 flags 的影响方式不同。",
    ],
  },
  {
    id: "gbz80-memory-control",
    title: "GBz80 Memory Access, Control Flow, Cycles, and Optimization",
    titleZh: "GBz80 内存访问、控制流、周期与优化",
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
    summaryZh:
      "GBz80 考题经常把代码含义和机器细节混在一起：labels、pointers、stack behavior、instruction sizes、cycle counts，以及 Game Boy memory map 的限制。",
    keyPoints: [
      "JP changes PC without saving a return address; CALL pushes a return address on the stack and RET pops it back.",
      "Labels are symbolic addresses. Brackets mean memory access, so label and [label] are not the same idea.",
      "For cycle counts, count taken and not-taken conditional branches separately, especially on the final loop iteration.",
      "Mutable gameplay variables normally belong in WRAM; VRAM and OAM are graphics-related and have PPU timing restrictions.",
    ],
    keyPointsZh: [
      "JP 会改变 PC，但不会保存返回地址；CALL 会把返回地址压入 stack，RET 再把它弹回 PC。",
      "Labels 是符号地址。方括号表示 memory access，所以 label 和 [label] 不是同一个概念。",
      "做 cycle count 时，要分别计算 taken 和 not-taken conditional branch，尤其是循环最后一次。",
      "会变化的游戏变量通常应放在 WRAM；VRAM 和 OAM 与图形有关，并受 PPU timing 限制。",
    ],
    workedExample:
      "A loop whose conditional JR is taken 9 times and not taken once has different branch costs for the first 9 iterations and the final exit iteration. You should write the total as setup + repeated body + final body.",
    workedExampleZh:
      "如果一个循环中的 conditional JR 前 9 次 taken、最后 1 次 not taken，那么前 9 次迭代和最后退出那次的 branch cost 不同。总周期应写成 setup + repeated body + final body。",
    commonTraps: [
      "Charging the final conditional branch as taken.",
      "Putting ordinary variables in VRAM instead of WRAM.",
      "Assuming all GBz80 instructions have a fixed length.",
    ],
    commonTrapsZh: [
      "把最后一次 conditional branch 也按 taken 来计周期。",
      "把普通变量放进 VRAM，而不是 WRAM。",
      "假设所有 GBz80 instructions 都是固定长度。",
    ],
  },
  {
    id: "mips-isa-datapath",
    title: "MIPS ISA, Single-Cycle Datapath, and Control",
    titleZh: "MIPS ISA、单周期数据通路与控制",
    priority: "A",
    lectureRefs: ["Lecture 09", "Lecture 10"],
    focusRefs: ["Focus 17.1-19.4"],
    questionTags: ["mips", "branch-addressing", "instruction-encoding", "single-cycle", "datapath", "lw"],
    summary:
      "MIPS is a regular RISC architecture. The exam focus is less about memorizing syntax and more about understanding instruction formats, register roles, branch addressing, and how data flows through the datapath.",
    summaryZh:
      "MIPS 是规则的 RISC architecture。考试重点不是死背语法，而是理解 instruction formats、register roles、branch addressing，以及数据如何流过 datapath。",
    keyPoints: [
      "Classic MIPS instructions are fixed 32-bit words, or 4 bytes.",
      "I-type instructions have a 16-bit immediate field; branches use PC+4 plus the sign-extended immediate shifted left by 2.",
      "In a single-cycle implementation, every instruction completes in one long cycle, so the slowest path sets the clock period.",
      "lw is usually the longest common path because it uses instruction memory, register read, ALU address calculation, data memory, and register writeback.",
    ],
    keyPointsZh: [
      "经典 MIPS instructions 是固定 32-bit word，也就是 4 bytes。",
      "I-type instructions 有 16-bit immediate field；branch target 使用 PC+4 加上 sign-extended immediate 左移 2 位。",
      "在 single-cycle 实现中，每条指令都在一个长周期内完成，因此最慢路径决定 clock period。",
      "lw 通常是最长的常见路径，因为它用到 instruction memory、register read、ALU address calculation、data memory 和 register writeback。",
    ],
    workedExample:
      "A beq at 0x00400020 with immediate 3 targets PC+4+3*4 = 0x00400024+0xC = 0x00400030.",
    workedExampleZh:
      "位于 0x00400020、immediate 为 3 的 beq，其目标地址是 PC+4+3*4 = 0x00400024+0xC = 0x00400030。",
    commonTraps: [
      "Adding the branch immediate as bytes instead of instruction words.",
      "Forgetting that $0 always reads as zero.",
      "Thinking single-cycle CPI=1 means every instruction is fast; the clock must still fit the slowest instruction.",
    ],
    commonTrapsZh: [
      "把 branch immediate 当作 byte offset 直接相加，而不是按 instruction word 计算。",
      "忘记 $0 永远读出 0。",
      "以为 single-cycle 的 CPI=1 就代表每条指令都很快；实际上 clock 仍必须容纳最慢指令。",
    ],
  },
  {
    id: "mips-multicycle-pipeline",
    title: "Multi-Cycle MIPS and Pipelined MIPS",
    titleZh: "多周期 MIPS 与流水线 MIPS",
    priority: "A",
    lectureRefs: ["Lecture 11", "Lecture 12"],
    focusRefs: ["Focus 20.1-21.9"],
    questionTags: ["mips", "multi-cycle", "pipeline", "performance", "load-use", "hazards"],
    summary:
      "Multi-cycle and pipelined processors both split instruction execution into stages, but for different purposes. Multi-cycle designs reuse hardware across time; pipelines overlap different instructions to improve throughput.",
    summaryZh:
      "Multi-cycle 和 pipelined processors 都会把指令执行拆成阶段，但目的不同。Multi-cycle 设计在不同时间复用硬件；pipeline 让不同指令重叠执行来提高 throughput。",
    keyPoints: [
      "Multi-cycle control is an FSM, and different instruction classes take different numbers of cycles.",
      "A five-stage pipeline has IF, ID, EX, MEM, and WB; without hazards, N instructions take N+4 cycles.",
      "Forwarding handles many RAW hazards, but a directly following load-use dependency usually still needs one stall.",
      "Control hazards from taken branches or jumps may require flushing wrongly fetched instructions.",
    ],
    keyPointsZh: [
      "Multi-cycle control 是一个 FSM，不同 instruction class 需要不同数量的 cycles。",
      "五级 pipeline 包含 IF、ID、EX、MEM 和 WB；没有 hazards 时，N 条指令需要 N+4 cycles。",
      "Forwarding 可以处理许多 RAW hazards，但紧跟在 lw 后面的 load-use dependency 通常仍需要 1 个 stall。",
      "Taken branch 或 jump 带来的 control hazards 可能需要 flush 已经错误取出的指令。",
    ],
    workedExample:
      "Twelve instructions in an ideal 5-stage pipeline take 12+4=16 cycles if there are no stalls or flushes. Add load-use stalls and control flush penalties on top of that baseline.",
    workedExampleZh:
      "在理想五级 pipeline 中，如果没有 stalls 或 flushes，12 条指令需要 12+4=16 cycles。在这个基准上再加 load-use stalls 和 control flush penalties。",
    commonTraps: [
      "Counting static code lines instead of dynamically executed instructions.",
      "Assuming forwarding solves a next-instruction load-use hazard.",
      "Confusing lower latency for one instruction with higher throughput for many instructions.",
    ],
    commonTrapsZh: [
      "只数静态代码行，而不是动态执行的指令数。",
      "以为 forwarding 可以解决紧邻下一条指令的 load-use hazard。",
      "把单条指令的低 latency 和多条指令的高 throughput 混淆。",
    ],
  },
];
