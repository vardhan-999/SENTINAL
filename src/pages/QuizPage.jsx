import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QuizQuestionCard } from "../components/QuizQuestionCard";
import { QuizResultReport } from "../components/QuizResultReport";
import { BookOpen, ChevronRight } from "lucide-react";

// ─── Question Bank keyed by topic keywords ────────────────────────────────────
const QUESTION_BANK = {
  "process scheduling": [
    { q: "Which scheduling algorithm gives each process a fixed time slice cyclically?", options: ["FCFS", "Round Robin", "Shortest Job First", "Priority Scheduling"], correct: 1, explanation: "Round Robin assigns a fixed time quantum to each process in cyclic order, ensuring fair CPU sharing among all processes." },
    { q: "What is the main disadvantage of FCFS scheduling?", options: ["It's non-preemptive", "Convoy Effect — short processes wait behind long ones", "It requires priority levels", "It uses excessive memory"], correct: 1, explanation: "The Convoy Effect causes short processes to wait a long time because a long process ahead blocks the CPU, reducing throughput." },
    { q: "Which scheduling algorithm has the minimum average waiting time for a given set of processes?", options: ["Round Robin", "FCFS", "Priority Scheduling", "Shortest Job First (SJF)"], correct: 3, explanation: "SJF minimises average waiting time by executing the shortest remaining job first, proven to be optimal for this metric." },
    { q: "Preemptive SJF is also known as:", options: ["Round Robin", "Shortest Remaining Time First (SRTF)", "Multilevel Queue", "Priority Without Preemption"], correct: 1, explanation: "Preemptive SJF preempts the running process whenever a shorter job arrives, hence called Shortest Remaining Time First." },
    { q: "Priority Scheduling may suffer from which problem?", options: ["Thrashing", "Starvation", "Deadlock", "Fragmentation"], correct: 1, explanation: "Low-priority processes may wait indefinitely if high-priority processes keep arriving — a problem solved by 'aging'." },
    { q: "Which scheduling algorithm is best for interactive systems?", options: ["FCFS", "SJF", "Round Robin", "Non-preemptive Priority"], correct: 2, explanation: "Round Robin's time-slicing gives each process CPU time regularly, providing responsive interaction for users." },
  ],
  "deadlock": [
    { q: "Which of the following is NOT a necessary condition for deadlock?", options: ["Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"], correct: 2, explanation: "The four necessary conditions are: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. Preemption prevents deadlock, not causes it." },
    { q: "The Banker's Algorithm is used for:", options: ["Deadlock Detection", "Deadlock Recovery", "Deadlock Avoidance", "Deadlock Prevention"], correct: 2, explanation: "The Banker's Algorithm checks if granting a resource request keeps the system in a 'safe state', thus avoiding deadlock." },
    { q: "Circular Wait can be prevented by:", options: ["Killing all processes", "Assigning a global ordering to resources", "Releasing all resources at startup", "Using semaphores only"], correct: 1, explanation: "Imposing a total ordering on all resource types and requiring processes to request resources in order eliminates circular wait." },
    { q: "Deadlock detection requires:", options: ["Resource ordering", "Safe state analysis", "Cycle detection in resource allocation graph", "Priority inheritance"], correct: 2, explanation: "A cycle in the resource allocation graph indicates a potential deadlock (definite deadlock when each resource has one instance)." },
    { q: "Which condition does Hold-and-Wait violate when prevented?", options: ["Processes must request all resources at once", "Resources must be released at end only", "Resources must be non-shareable", "Processes run in strict order"], correct: 0, explanation: "Preventing Hold-and-Wait requires a process to request all needed resources at once before execution begins, so it never holds partially." },
    { q: "Resource preemption as a recovery strategy from deadlock means:", options: ["Terminating all processes", "Forcibly taking a resource from a process", "Restarting the OS", "Denying future requests"], correct: 1, explanation: "Resource preemption forcibly takes allocated resources from some process and gives them to others to break the deadlock cycle." },
  ],
  "normalization": [
    { q: "Which normal form removes partial dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], correct: 1, explanation: "2NF (Second Normal Form) eliminates partial dependencies — where a non-key attribute depends on only part of a composite primary key." },
    { q: "A table is in 3NF if:", options: ["It has no repeating groups", "It has no partial dependencies", "It has no transitive dependencies", "Every attribute is a candidate key"], correct: 2, explanation: "3NF eliminates transitive dependencies, where a non-key attribute depends on another non-key attribute rather than directly on the primary key." },
    { q: "BCNF is a stricter version of:", options: ["1NF", "2NF", "3NF", "4NF"], correct: 2, explanation: "BCNF (Boyce-Codd Normal Form) is a stronger version of 3NF where every determinant must be a candidate key." },
    { q: "Denormalization is done to:", options: ["Reduce redundancy", "Improve query read performance", "Enforce integrity constraints", "Apply BCNF"], correct: 1, explanation: "Denormalization intentionally introduces redundancy to reduce expensive JOIN operations and speed up read-heavy queries." },
    { q: "Which anomaly occurs when deleting a row unintentionally removes other useful data?", options: ["Insertion anomaly", "Update anomaly", "Deletion anomaly", "Referential anomaly"], correct: 2, explanation: "A deletion anomaly happens when removing a record causes loss of other important information that was stored in the same row." },
    { q: "First Normal Form (1NF) requires:", options: ["No transitive dependency", "Atomic column values only", "No partial dependency", "All keys to be composite"], correct: 1, explanation: "1NF requires that every column contains atomic (indivisible) values and no column contains a set or list of values." },
  ],
  "b+ tree": [
    { q: "In a B+ tree, actual data records are stored in:", options: ["Root node", "Internal nodes", "Leaf nodes", "All nodes equally"], correct: 2, explanation: "B+ trees store all actual data records exclusively in leaf nodes, while internal nodes hold only keys to guide searches." },
    { q: "Leaf nodes in a B+ tree are:", options: ["Sorted by insertion order", "Linked together as a doubly-linked list", "Completely independent", "Stored in a heap"], correct: 1, explanation: "Leaf nodes are linked in a sorted linked list, enabling efficient range queries by traversing leaves sequentially." },
    { q: "What is the time complexity of a point search in a B+ tree of n records?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: 2, explanation: "B+ tree search is O(log n) because the tree height is logarithmic relative to the number of records." },
    { q: "The 'order' of a B+ tree defines:", options: ["Height of the tree", "Maximum number of children per node", "Number of leaf nodes", "Key type allowed"], correct: 1, explanation: "The order (or degree) m of a B+ tree means every non-leaf node can have at most m children, controlling the tree's fanout." },
    { q: "B+ trees are preferred over B-trees for databases primarily because:", options: ["B-trees use more memory", "B+ trees support efficient range queries via linked leaves", "B-trees cannot store integers", "B+ trees are always balanced at leaf level"], correct: 1, explanation: "Since all data is in linked leaf nodes, B+ trees allow sequential range scans without revisiting internal nodes." },
  ],
  "congestion control": [
    { q: "TCP uses which mechanism to handle network congestion?", options: ["Fixed window", "AIMD (Additive Increase Multiplicative Decrease)", "Token bucket only", "Stop-and-wait"], correct: 1, explanation: "TCP's AIMD probes for bandwidth by additively increasing the window and multiplicatively decreasing it upon detecting congestion." },
    { q: "During TCP Slow Start, the congestion window grows:", options: ["Linearly", "Exponentially", "Logarithmically", "Stays constant"], correct: 1, explanation: "In Slow Start, cwnd doubles every RTT (exponential growth) until it reaches the slow start threshold (ssthresh)." },
    { q: "When packet loss is detected via triple duplicate ACKs, TCP performs:", options: ["Connection reset", "Fast Retransmit + Fast Recovery", "Full Slow Start", "Window set to zero"], correct: 1, explanation: "Triple duplicate ACKs trigger Fast Retransmit (immediate retransmission) and Fast Recovery (halves cwnd, stays in congestion avoidance)." },
    { q: "Which field in the TCP header is used for flow control?", options: ["Sequence Number", "Checksum", "Receive Window", "Acknowledgement Number"], correct: 2, explanation: "The Receive Window field tells the sender how much buffer space the receiver has left, preventing the sender from overwhelming it." },
    { q: "ECN (Explicit Congestion Notification) allows:", options: ["Routers to drop packets silently", "Routers to signal congestion without dropping packets", "Hosts to bypass TCP", "UDP to detect congestion"], correct: 1, explanation: "ECN lets routers mark packets with congestion signals so hosts can reduce their transmission rate before packet loss occurs." },
  ],
  "routing protocols": [
    { q: "Which routing protocol uses the Bellman-Ford algorithm?", options: ["OSPF", "BGP", "RIP", "EIGRP"], correct: 2, explanation: "RIP (Routing Information Protocol) uses the Bellman-Ford distance vector algorithm to compute shortest paths based on hop count." },
    { q: "OSPF is classified as a:", options: ["Distance Vector Protocol", "Link State Protocol", "Path Vector Protocol", "Hybrid Protocol"], correct: 1, explanation: "OSPF (Open Shortest Path First) is a link-state protocol where each router maintains a complete topology map using Dijkstra's SPF algorithm." },
    { q: "BGP is primarily used for:", options: ["LAN routing", "Inter-domain (between ISPs) routing", "Wireless mesh routing", "Multicast routing"], correct: 1, explanation: "BGP (Border Gateway Protocol) is the EGP (Exterior Gateway Protocol) used for routing between autonomous systems on the internet." },
    { q: "The maximum hop count in RIP is:", options: ["8", "16", "32", "Unlimited"], correct: 1, explanation: "RIP has a maximum hop count of 15; 16 hops means 'unreachable', limiting RIP to small networks." },
  ],
  default: [
    { q: "What does CPU stand for?", options: ["Central Processing Unit", "Core Power Unit", "Computer Process Utility", "Central Program Uploader"], correct: 0, explanation: "CPU stands for Central Processing Unit — the primary component of a computer that executes instructions." },
    { q: "Which data structure uses LIFO (Last In First Out)?", options: ["Queue", "Stack", "Linked List", "Heap"], correct: 1, explanation: "A Stack operates on Last In First Out — the last item pushed is the first one popped." },
    { q: "What does RAM stand for?", options: ["Read Access Memory", "Random Access Memory", "Run Allocated Memory", "Rapid Active Module"], correct: 1, explanation: "RAM (Random Access Memory) is volatile computer memory used to store data and programs currently in use." },
    { q: "Which layer of OSI handles end-to-end communication?", options: ["Network Layer", "Data Link Layer", "Transport Layer", "Session Layer"], correct: 2, explanation: "The Transport Layer (Layer 4) is responsible for end-to-end communication, error recovery, and flow control." },
    { q: "A foreign key establishes a relationship between:", options: ["Two columns in the same table", "A table and its index", "Two different tables", "A view and a table"], correct: 2, explanation: "A foreign key in one table references the primary key of another table, enforcing referential integrity between them." },
    { q: "Which sorting algorithm has the best average-case time complexity?", options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], correct: 2, explanation: "Merge Sort has O(n log n) average-case complexity — better than O(n²) algorithms like Bubble, Insertion, or Selection Sort." },
  ],
};

function getQuestions(topic) {
  const t = topic.toLowerCase();
  for (const [key, qs] of Object.entries(QUESTION_BANK)) {
    if (key !== "default" && t.includes(key)) return shuffle(qs).slice(0, 6);
  }
  return shuffle(QUESTION_BANK.default).slice(0, 5);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function QuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawTopic = searchParams.get("topic") || "General Knowledge";
  const source = searchParams.get("from") || "workspace"; // "revision" or "workspace"

  const title = source === "revision"
    ? `Revision Quiz — ${rawTopic}`
    : `Topic Quiz — ${rawTopic}`;

  const [questions, setQuestions] = useState(() => getQuestions(rawTopic));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { qIndex: selectedOptionIndex }
  const [showReport, setShowReport] = useState(false);

  const handleSelect = useCallback((optionIdx) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  }, [currentIdx]);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      setShowReport(true);
    }
  };

  const handleRetake = () => {
    setQuestions(getQuestions(rawTopic));
    setAnswers({});
    setCurrentIdx(0);
    setShowReport(false);
  };

  const score = Object.entries(answers).filter(
    ([idx, opt]) => questions[parseInt(idx)]?.correct === opt
  ).length;

  const isAnswered = answers[currentIdx] !== undefined;
  const isLast = currentIdx === questions.length - 1;

  return (
    <div className="h-full w-full max-w-2xl mx-auto flex flex-col gap-6 items-center">

      {/* ── Header ── */}
      {!showReport && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Knowledge Check
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-sm text-gray-400 mt-1">Test your understanding before moving forward.</p>
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </motion.div>
      )}

      {/* ── Quiz Body ── */}
      <div className="w-full flex-1">
        <AnimatePresence mode="wait">
          {!showReport ? (
            <div key="quiz" className="flex flex-col gap-5">
              <QuizQuestionCard
                question={questions[currentIdx]}
                qIndex={currentIdx}
                total={questions.length}
                selected={answers[currentIdx] ?? null}
                onSelect={handleSelect}
              />

              {/* Next / Finish */}
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_25px_rgba(79,70,229,0.35)] hover:shadow-[0_0_40px_rgba(79,70,229,0.55)] transition-all"
                  >
                    {isLast ? "View Results" : "Next Question"}
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            <QuizResultReport
              key="report"
              score={score}
              total={questions.length}
              topic={title}
              onRetake={handleRetake}
              onReturn={() => navigate(source === "revision" ? "/revision" : -1)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[20%] right-[5%] w-[30%] h-[35%] bg-indigo-600/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[5%] left-[5%] w-[25%] h-[25%] bg-purple-500/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
