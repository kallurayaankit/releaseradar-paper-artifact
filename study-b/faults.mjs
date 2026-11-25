// Synthetic fault catalogue. Partitions fixed before evaluating any candidate suite.
export function correct(task, input) {
  switch (task) {
    case 'discount': return input.amount >= 10000 ? Math.floor(input.amount / 10) : 0;
    case 'tax': return Math.floor((input.amount * input.rate + 5000) / 10000);
    case 'refund': return Math.min(input.requested, input.paid - input.refunded);
    case 'eligibility': return input.age >= 18 && input.tenure >= 6 && !input.suspended;
    default: throw new Error(`Unknown task: ${task}`);
  }
}
const f = (id, task, partition, intent, witness, run) => ({id, task, partition, intent, witness, run});
export const faults = [
  f('discount-d1','discount','development','Exclude exact qualifying threshold.',{amount:10000},i => i.amount > 10000 ? Math.floor(i.amount/10) : 0),
  f('discount-d2','discount','development','Round qualifying discount rather than floor.',{amount:10005},i => i.amount >= 10000 ? Math.round(i.amount/10) : 0),
  f('discount-d3','discount','development','Apply five percent rather than ten percent.',{amount:12000},i => i.amount >= 10000 ? Math.floor(i.amount/20) : 0),
  f('discount-h1','discount','heldout','Introduce erroneous 1000-cent discount cap.',{amount:15000},i => i.amount >= 10000 ? Math.min(1000,Math.floor(i.amount/10)) : 0),
  f('discount-h2','discount','heldout','Qualify purchases ten cents below threshold.',{amount:9990},i => i.amount >= 9990 ? Math.floor(i.amount/10) : 0),
  f('discount-h3','discount','heldout','Deduct erroneous 50-cent processing charge from discount.',{amount:12000},i => i.amount >= 10000 ? Math.max(0,Math.floor(i.amount/10)-50) : 0),
  f('tax-d1','tax','development','Truncate fractional tax.',{amount:3,rate:2500},i => Math.floor(i.amount*i.rate/10000)),
  f('tax-d2','tax','development','Always round fractional tax upward.',{amount:1,rate:1000},i => Math.ceil(i.amount*i.rate/10000)),
  f('tax-d3','tax','development','Misinterpret basis-point denominator by factor ten.',{amount:100,rate:100},i => Math.floor((i.amount*i.rate+500)/1000)),
  f('tax-h1','tax','heldout','Use ties-to-even rather than half-up rounding.',{amount:2,rate:2500},i => {const p=i.amount*i.rate; const q=Math.floor(p/10000); const r=p%10000; return r===5000 ? q+(q%2) : Math.floor((p+5000)/10000);}),
  f('tax-h2','tax','heldout','Introduce erroneous 1000-cent tax cap.',{amount:20000,rate:2500},i => Math.min(1000,Math.floor((i.amount*i.rate+5000)/10000))),
  f('tax-h3','tax','heldout','Exempt purchases below 100 cents.',{amount:99,rate:2500},i => i.amount<100 ? 0 : Math.floor((i.amount*i.rate+5000)/10000)),
  f('refund-d1','refund','development','Ignore prior refunded amount.',{paid:1000,refunded:800,requested:500},i => Math.min(i.requested,i.paid)),
  f('refund-d2','refund','development','Choose larger rather than smaller of request and balance.',{paid:1000,refunded:0,requested:100},i => Math.max(i.requested,i.paid-i.refunded)),
  f('refund-d3','refund','development','Subtract erroneous 100-cent refund fee.',{paid:1000,refunded:0,requested:500},i => Math.max(0,Math.min(i.requested,i.paid-i.refunded)-100)),
  f('refund-h1','refund','heldout','Reject over-balance request instead of partially refunding.',{paid:1000,refunded:500,requested:600},i => i.requested>i.paid-i.refunded ? 0 : i.requested),
  f('refund-h2','refund','heldout','Reject refunds smaller than 100 cents.',{paid:1000,refunded:0,requested:99},i => {const r=Math.min(i.requested,i.paid-i.refunded); return r<100 ? 0 : r;}),
  f('refund-h3','refund','heldout','Double-count prior refunds when computing balance.',{paid:1000,refunded:200,requested:900},i => Math.min(i.requested,Math.max(0,i.paid-2*i.refunded))),
  f('eligibility-d1','eligibility','development','Require age strictly greater than 18.',{age:18,tenure:6,suspended:false},i => i.age>18 && i.tenure>=6 && !i.suspended),
  f('eligibility-d2','eligibility','development','Require tenure strictly greater than 6.',{age:25,tenure:6,suspended:false},i => i.age>=18 && i.tenure>6 && !i.suspended),
  f('eligibility-d3','eligibility','development','Ignore suspension.',{age:25,tenure:10,suspended:true},i => i.age>=18 && i.tenure>=6),
  f('eligibility-h1','eligibility','heldout','Allow either age or tenure requirement to suffice.',{age:17,tenure:6,suspended:false},i => (i.age>=18 || i.tenure>=6) && !i.suspended),
  f('eligibility-h2','eligibility','heldout','Expire eligibility after 24 completed months.',{age:25,tenure:25,suspended:false},i => i.age>=18 && i.tenure>=6 && i.tenure<=24 && !i.suspended),
  f('eligibility-h3','eligibility','heldout','Add erroneous maximum eligible age of 65.',{age:66,tenure:6,suspended:false},i => i.age>=18 && i.age<=65 && i.tenure>=6 && !i.suspended)
];
