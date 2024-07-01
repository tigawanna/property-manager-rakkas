export async function testGithubToken(gh_token: string) {
    try {
        const viewer = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + gh_token,
            },
            body: JSON.stringify({
                query: `
      {
        viewer {
          login
          name
          avatarUrl
          email
        }
      }
    `,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const data = response.json();

                return data
            })
            .then((data) => {
                // console.log(" ====== Github token validator response ============== ", data)
                return data as any as {
                    data: {
                        viewer: {
                            login: string;
                            name: string;
                            avatarUrl: string;
                            email: string;
                        };
                    };
                };
                // console.log(" ====== Github token valid ============== ", data)
            });
        return viewer;
    } catch (error: any) {
        // console.log(" ====== Github token invalid ============== ", error)
        // return error.message
        throw error
    }
}
