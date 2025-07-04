import { neon } from '@neondatabase/serverless';

//Expo Api Route
//Poziva se iz lib fetch.ts

export async function POST(request: Request) { //Neon SQL
    try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const {name, email, clerkId} = await request.json();

    if(!name || !email || !clerkId) {
        return Response.json(
             {error: 'Missing required fields'},
             {status: 400}
        )
    }
//Prethodno smo u Neon db kreirali tabelu user sa poljima id, name, email i clerk_id
    const response = await sql`
        INSERT INTO users (
            name,
            email,
            clerk_id
        )
        VALUES (
            ${name},
            ${email},
            ${clerkId},
        )
    `;

    return new Response(JSON.stringify({data: response}), {
        status: 201,
    })

    
        
    } catch (error) {
        console.log(error);
        return Response.json({error: error}, {status: 500});
    }
}