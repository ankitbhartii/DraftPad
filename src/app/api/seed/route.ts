import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Define the book structures to seed matching the screenshot
const booksToSeed = [
  // ROW 1: Top Picks
  {
    title: '27 Days',
    description: 'When Hadley is offered a second chance to change the course of history, she goes back 27 days in time. But changing the past comes with unexpected consequences.',
    cover_url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=400',
    genre: 'Romance',
    reads: '51.4M',
    votes: '2.4M',
  },
  {
    title: 'It Started with a High Top',
    description: 'An accidental mix-up of high top converse sneakers under a desk sparks a secret note-sharing romance between two students from different cliques.',
    cover_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400',
    genre: 'Teen Fiction',
    reads: '14.7M',
    votes: '890K',
  },
  {
    title: 'Pride and Prejudice',
    description: 'The classic tale of Elizabeth Bennet and Mr. Darcy as they navigate love, class pride, and societal expectations in 19th century England.',
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400',
    genre: 'Classics',
    reads: '10.5M',
    votes: '412K',
  },
  {
    title: 'Sense and Sensibility',
    description: 'The lives and loves of the Dashwood sisters, Elinor and Marianne, representing the contrasting traits of reason and emotional sensitivity.',
    cover_url: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=400',
    genre: 'Classics',
    reads: '603K',
    votes: '28K',
  },
  {
    title: 'Just Breathe',
    description: 'A soothing romantic story about finding hope and learning to breathe again after a life-altering tragedy in the quiet countryside.',
    cover_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400',
    genre: 'Romantic',
    reads: '97.8K',
    votes: '5.2K',
  },
  {
    title: 'My Fake Boyfriend',
    description: 'To satisfy her family, she hires a fake boyfriend for the summer. What she did not plan on was falling in love with his secret side.',
    cover_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400',
    genre: 'Romance',
    reads: '101M',
    votes: '4.8M',
  },
  {
    title: "The Vampire's Pet",
    description: 'In a world ruled by ancient vampire dynasties, a young woman finds herself selected as the personal companion to the cold crown prince.',
    cover_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400',
    genre: 'Paranormal',
    reads: '23.5M',
    votes: '1.2M',
  },
  {
    title: 'Forcefully Yours',
    description: 'A dark mafia romance. Arranged to marry the heir of the rival family to bring peace, she vows to fight him, but passion gets in the way.',
    cover_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400',
    genre: 'Dark Romance',
    reads: '4.3M',
    votes: '198K',
  },

  // ROW 2: Top 10 in India
  {
    title: 'Her Cursed Prince',
    description: 'A royal arranged marriage tale. The crown prince carries a deadly secret curse, and she is the only one who can break it or die trying.',
    cover_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400',
    genre: 'Fantasy Romance',
    reads: '12.8M',
    votes: '590K',
  },
  {
    title: 'Broken Promises',
    description: 'He promised to return after college, but came back with another woman on his arm. Can old vows ever be repaired?',
    cover_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400',
    genre: 'Drama',
    reads: '8.4M',
    votes: '390K',
  },
  {
    title: 'Seducing the Senior',
    description: 'An academic rivals-to-lovers story set in a top Indian university. A junior takes a challenge that escalates into real feelings.',
    cover_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400',
    genre: 'Desi Romance',
    reads: '2.5M',
    votes: '110K',
  },
  {
    title: 'Make me Professor',
    description: 'A workplace romance between a strict substitute professor and his brilliant assistant, trying to hide their bond from the college senate.',
    cover_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=400',
    genre: 'Romance',
    reads: '1.9M',
    votes: '95K',
  },
  {
    title: 'Throne and Thread',
    description: 'A royal dynasty story of silk weavers and court intrigue. A humble tailor gets tangled in the schemes of the empire.',
    cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400',
    genre: 'Dynasty',
    reads: '620K',
    votes: '32K',
  },
  {
    title: 'May I Come in, Sir?',
    description: 'A corporate office drama where business contracts and personal hearts collide under the late-night city lights.',
    cover_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400',
    genre: 'Office Drama',
    reads: '3.1M',
    votes: '142K',
  },
  {
    title: 'His Butterfly',
    description: 'A sweet story of a shy botanist and a social media star crossing paths during a summer research trip.',
    cover_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400',
    genre: 'Sweet Romance',
    reads: '410K',
    votes: '18K',
  },
  {
    title: "Leo's Replaced Bride",
    description: 'Sent to the altar in place of her sister who ran away, she expects rejection. Instead, she finds a husband willing to discover the truth.',
    cover_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400',
    genre: 'Romance',
    reads: '15.4M',
    votes: '730K',
  },
];

export async function POST() {
  try {
    console.log('[Seeder] Starting DB seed of Wattpad picks.');

    const authorId = '00000000-0000-0000-0000-000000000000'; // Static UUID for curator

    // Directly upsert seed profile in profiles table without touching auth.users
    const { error: profileUpsertError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authorId,
        username: 'wattpad_curator',
        display_name: 'Wattpad Curator',
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=WattpadCurator`
      }, {
        onConflict: 'id'
      });

    if (profileUpsertError) {
      throw new Error(`Profile setup failed: ${profileUpsertError.message}`);
    }

    // Wipe all existing stories to prevent duplicates during seeder runs
    const { error: deleteStoriesError } = await supabaseAdmin
      .from('stories')
      .delete()
      .neq('title', 'nonexistent_title_placeholder');

    if (deleteStoriesError) {
      console.warn('[Seeder] Error cleaning up old stories:', deleteStoriesError);
    }

    const seededStories = [];

    // 2. Loop and insert each book along with dynamic chapters
    for (const book of booksToSeed) {
      // Insert Story (will generate uuid)
      const { data: story, error: storyError } = await supabaseAdmin
        .from('stories')
        .insert({
          title: book.title,
          description: book.description,
          cover_url: book.cover_url,
          author_id: authorId,
          status: 'published',
        })
        .select('id, title')
        .single();

      if (storyError) {
        console.error(`[Seeder] Error inserting story "${book.title}":`, storyError);
        continue;
      }

      seededStories.push(story);

      // Create 3 structured chapters for this story
      const chaptersToCreate = [
        {
          title: 'Chapter 1: The First Encounter',
          content: `
            <p>It was a typical Tuesday when it all began. The atmosphere was thick with anticipation. Hadley was sitting near the window, watching the rain strike the glass.</p>
            <p>Every small detail seemed magnified. A shadow fell across the table, and when she looked up, everything changed. It was the spark that would ignite the entire journey.</p>
            <blockquote>"I never expected to find you here," he said softly, his voice barely audible over the rumble of thunder.</blockquote>
            <p>She took a deep breath, wondering if she was ready for what was about to unfold.</p>
          `,
        },
        {
          title: 'Chapter 2: Unspoken Words',
          content: `
            <p>Days turned into weeks, and the silence between them grew louder. There were a thousand things left unsaid, hanging in the air like heavy dew before dawn.</p>
            <p>Every glance was loaded with meaning. She tried to focus on her work, but the memories of that afternoon kept pulling her back.</p>
            <p>Sometimes, the greatest stories are written in the margins of what we choose not to say.</p>
          `,
        },
        {
          title: 'Chapter 3: The Crossroads',
          content: `
            <p>The final decision could no longer be postponed. The path ahead split in two directions, each leading to a completely different destiny.</p>
            <p>She stood at the crossroads, holding the key in her hand. The breeze carried the scent of autumn leaves and distant smoke.</p>
            <p>She took the first step, knowing there was no turning back.</p>
          `,
        },
      ];

      if (story.title === 'Through My Window') {
        for (let i = 1; i <= 129; i++) {
          let content = '';
          if (i === 1) {
            content = `
              <p>It all started with the Wi-Fi password.</p>
              <p>Ares Hidalgo, my next-door neighbor, was the boy who watched from across the hallway. For the longest time, I thought he didn't even know my name.</p>
              <p>But when he hacked my connection, it sparked a game of secrets that neither of us could stop.</p>
            `;
          } else if (i === 2) {
            content = `
              <p>The Hidalgo family was legendary in our town—wealthy, aloof, and extremely attractive. Ares was the middle brother, the one who seemed cold as stone.</p>
              <p>I watched him return home late at night, his silhouette silhouetted against the terrace light. "Through my window" was the only way I knew him.</p>
            `;
          } else {
            content = `
              <p>This is Chapter ${i} of the story of Raquel and Ares Hidalgo.</p>
              <p>They watched each other from across the terrace. The Wi-Fi connection had brought them together, but the secrets of the Hidalgo family threatened to pull them apart.</p>
              <p>As the days passed, every encounter through the window became more intense. Raquel knew she was playing with fire, but she couldn't bring herself to step away from the flame.</p>
            `;
          }

          const { error: chError } = await supabaseAdmin
            .from('chapters')
            .insert({
              story_id: story.id,
              title: i === 1 
                ? 'Chapter 1: The Wi-Fi Password' 
                : i === 2 
                ? 'Chapter 2: The Hidalgo Brothers' 
                : i === 3 
                ? 'Chapter 3: Across the Hallway' 
                : `Chapter ${i}: Hidalgo Legacy Part ${i}`,
              content: content,
              sort_order: i,
            });

          if (chError) {
            console.error(`[Seeder] Error inserting chapter ${i} for "${story.title}":`, chError);
          }
        }
      } else {
        for (let i = 0; i < chaptersToCreate.length; i++) {
          const ch = chaptersToCreate[i];
          const { error: chError } = await supabaseAdmin
            .from('chapters')
            .insert({
              story_id: story.id,
              title: ch.title,
              content: ch.content,
              sort_order: i + 1,
            });

          if (chError) {
            console.error(`[Seeder] Error inserting chapter for "${story.title}":`, chError);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${seededStories.length} Wattpad pick stories with chapters successfully.`,
      stories: seededStories,
    });

  } catch (error: any) {
    console.error('[Seeder] Fatal error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
