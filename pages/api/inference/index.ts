import { createPagesServerClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabaseServerClient = createPagesServerClient({ req, res, })
    const { data: { user } } = await supabaseServerClient.auth.getUser();

    if (!user) {
        return res.status(401).end('Unauthorized');
    }

    switch (req.method) {
        case 'GET':
            // Get user projects rows from supabase
            const { data: projects } = await supabaseServerClient.from('projects').select('*').eq('auth_id', user?.id);

            // TODO Get user projects rows from inference
            const inferenceProjects = [{ id: 1, name: 'mock test project 1' }, { id: 2, name: 'test 2' }];

            // return inference rows
            res.status(200).json(inferenceProjects)
            break;

        case 'POST':
            res.status(201).json({})
            break;

        case 'PATCH':
            res.status(200).json({})
            break;

        default:
            res.status(405).end(`${req.method} Not Allowed`);
            break;
    }
}