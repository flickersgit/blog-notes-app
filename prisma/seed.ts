import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

const posts = [
  {
    title: 'Monday, January 27',
    content: `<h1>The Department of Lost Socks</h1>
<p>Today I discovered that my washing machine has been secretly employed by the Bureau of Everyday Absurdities all along. Agent Thompson, a man with an impressive mustache and an even more impressive collection of mismatched socks, knocked on my door at precisely 7:43 AM.</p>
<p>"We need to discuss your sock situation," he said, flipping open a leather-bound notebook filled with hand-drawn diagrams of feet.</p>
<p>Apparently, every sock that disappears in the wash doesn't actually vanish—it gets reassigned. My missing argyle? Now living its best life as a hand puppet in a Norwegian kindergarten. The fuzzy blue one with the hole? Promoted to "official dust cloth" in a museum in Prague.</p>
<p>"It's all very organized," Agent Thompson assured me, handing me a form titled <em>Sock Redistribution Acknowledgment Form 27-B</em>. "We've been doing this since 1847."</p>
<p>I asked if I could get my socks back. He laughed for exactly three seconds, then stopped abruptly.</p>
<p>"That's not how the Bureau works," he said. "But we can offer you a complimentary sock—previously owned by someone in Belgium."</p>
<p>It was orange. I kept it.</p>`,
    published: true,
  },
  {
    title: 'Tuesday, January 28',
    content: `<h1>The Committee for Unnecessary Waiting</h1>
<p>I arrived at the DMV this morning only to find it had been temporarily converted into a satellite office for the Bureau of Everyday Absurdities. A woman with a clipboard and glasses that seemed to have too many lenses approached me immediately.</p>
<p>"You're here for the waiting, yes?" she asked.</p>
<p>I explained I needed to renew my license. She nodded knowingly and handed me ticket number 847. The screen displayed: <strong>Now Serving: 12</strong>.</p>
<p>"The wait is the point," she explained. "We've determined that humans do their best existential thinking while waiting in government buildings. Fluorescent lighting and beige walls optimize the experience."</p>
<p>I sat down between a man who was knitting what appeared to be a very long scarf (he'd been there since 2019, he said) and a woman reading a book titled <em>Advanced Waiting: A Philosophy</em>.</p>
<p>Three hours later, my number was called. But instead of a license, they handed me a certificate.</p>
<p>"Congratulations," the clerk said. "You've completed Level 1 Waiting. Your actual license renewal will require you to complete Levels 2 through 7. Please take a new number."</p>
<p>The number was 2,847. I'm still here. The scarf is now twelve feet long.</p>`,
    published: true,
  },
  {
    title: 'Wednesday, January 29',
    content: `<h1>The Office of Misplaced Confidence</h1>
<p>A letter arrived today, stamped with an official-looking seal depicting a peacock wearing a monocle. Inside was an invitation to visit the Bureau's Department of Misplaced Confidence.</p>
<p>"Your application has been received," the letter read. I hadn't applied for anything.</p>
<p>The office was located on the 13th floor of a building that only had 12 floors. The elevator operator, a cheerful man named Gerald, explained that the 13th floor exists "only for those who press the button with absolute certainty that it won't work."</p>
<p>The department itself was filled with filing cabinets labeled with names of everyday situations: <em>Parallel Parking</em>, <em>Public Speaking</em>, <em>Cooking for Guests</em>, <em>Dancing at Weddings</em>.</p>
<p>A bureaucrat with a name tag reading "Assistant to the Regional Director of Unwarranted Certainty" handed me my file. It was three inches thick.</p>
<p>"Your confidence levels have been flagged," she said. "On March 15th, 2019, you told someone you were 'pretty good' at chess. Our records indicate you lose to a seven-year-old regularly."</p>
<p>I couldn't argue. The seven-year-old was ruthless.</p>
<p>They adjusted my confidence settings and sent me home. Now I'm 15% less certain about everything, which honestly feels about right.</p>`,
    published: true,
  },
  {
    title: 'Thursday, January 30',
    content: `<h1>The Bureau's Annual Audit of Minor Inconveniences</h1>
<p>This morning I stubbed my toe on the coffee table. Within seconds, a woman in a gray suit materialized in my living room, taking notes.</p>
<p>"Excellent," she murmured. "The furniture placement is working exactly as intended."</p>
<p>She introduced herself as Director Chen of the Bureau's Division of Minor Inconveniences. Apparently, every slightly annoying thing that happens to us is carefully orchestrated.</p>
<p>"The shopping cart with the wobbly wheel? Assigned specifically to you," she explained proudly. "The WiFi that cuts out during important video calls? That's Jenkins in Technical—he's been with us forty years."</p>
<p>She showed me charts and graphs: a careful balance must be maintained. Too few inconveniences, and humans become complacent. Too many, and they start asking questions.</p>
<p>"We're particularly proud of the 'phone charger that only works at a specific angle' initiative," she said. "That was my idea. Won Bureau Employee of the Month, 2017."</p>
<p>I asked why they were telling me all this. She smiled and handed me an invoice.</p>
<p>"You're three inconveniences behind quota this quarter. We'll need to schedule a makeup session. How do you feel about getting shampoo in your eyes?"</p>
<p>I negotiated it down to one stuck zipper and a pen that runs out of ink mid-signature.</p>`,
    published: true,
  },
  {
    title: 'Friday, January 31',
    content: `<h1>The Department of Forgotten Words</h1>
<p>I woke up this morning unable to remember the word for that thing—you know, the thing you use to—it's like a—anyway, I couldn't remember it.</p>
<p>By noon, three Bureau agents had arrived at my door with a search warrant for my vocabulary.</p>
<p>"We've detected unauthorized word loss," the lead agent announced. He was carrying a butterfly net, which he explained was "standard equipment for capturing escaped vocabulary."</p>
<p>The Department of Forgotten Words, I learned, is responsible for managing the natural cycle of human language. Words must be periodically forgotten to make room for new ones.</p>
<p>"Someone had to forget 'defenestration' so 'selfie' could exist," the agent explained solemnly. "It's all very scientific."</p>
<p>They searched my apartment for forty-five minutes before finding my missing word hiding behind the refrigerator, trying to blend in with the dust bunnies.</p>
<p>It was "spatula." I'd been calling it "the flippy thing" for three days.</p>
<p>They returned it to me with a warning: "Try to use it at least twice a week, or it goes back into circulation. Someone in Finland has been requesting it."</p>
<p>I made pancakes immediately. The spatula seemed grateful.</p>
<p>The Bureau sent a follow-up survey asking about my word retention experience. I gave them four out of five stars. Would have been five, but I forgot the word for "excellent."</p>`,
    published: true,
  },
]

async function main() {
  console.log('Deleting all existing posts...')
  await prisma.post.deleteMany()

  console.log('Creating new posts...')
  for (const post of posts) {
    await prisma.post.create({
      data: {
        title: post.title,
        slug: `note-${nanoid(10)}`,
        content: post.content,
        published: post.published,
      },
    })
    console.log(`Created: ${post.title}`)
  }

  console.log('Done! Created 5 Bureau of Everyday Absurdities posts.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
