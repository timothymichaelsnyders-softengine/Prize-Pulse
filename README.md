## Beginning
---

- Install Shad CN ui
    > In terminal : npx shadcn@latest init
    > Select Base
    > Select `Nova` (I think, or the First option)

- `npm run dev` in terminal

- Rename the `app/page.js` to `page.jsx`
- Start designing the `page.jsx`

# Header
- Has 2 components: 
    >the logo
    > Auth Button

[Underneath:]

# Hero section
- We will render the `cards` using an `object` of `FEATURES`

# Input field
- The `input field` will be a seperate `component`
- Create a new component called `AddProductForm.jsx`
- This component will take the `user` `information` (so the `user prop`)

- Install all the ShadCN UI components that we need:
    > npx shadcn@latest add input alert badge card dialog sonner

- Create the form.
    > Add an `<Input />`, of `type="url"`
    > We will need a state (`useState`) to store this URL.
    > Add `"use client"` because we are using `hooks`.

    > Add `disabled={loading}`, so that when we are fetching, this input field cannot be used.

    > Add a `submit btn`.


## Backend and Service for scraping website Setup
---

>> `Firecrawl` : https://www.firecrawl.dev/
- For testing purposes on the JSON markdown, add the following prompt: "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code (USD, EUR, etc) as 'currencyCode', and product image URL as 'productImageUrl' if available"

- Set the Schema as well with the variables mentioned in the prompt.

- Copy the API Key, and add it to the `.env` file.
- Install the `firecrawl` package: 
    > npm i @mendable/firecrawl-js

>> Supabase
# Website
---
- Sign Up/Login
- Start project
- Project Setup
    > Name
    > Database Password
    > ...
- Copy `environment variables` and paste in `.env` file
- Add addition Keys:
    > `Go to Project Settings > API Keys > Legacy anon, service_role API keys...`
    > Copy `both` Keys and paste in .env file

- Rename them `NEXT_PUBLIC_SUPABASE_ANON_KEY` & `SUPABASE_SERVICE_ROLE_KEY`

# VSCode IDE
---
- Install SUPABASE in our Application:
    > npm i @supabase/supabase-js
    > npm i @supabase/ssr
    > One is for the `client` (lib/supabase/client.ts), and the other is for the `server` (lib/supabase/server.ts)

- But we will be placing these files in a `utils` folder.
- Create a folder in the main project directory called `utils`.
- In the `utils` folder create a folder called `supabase`.
- In the supabase folder create a file called `client.js`
    > Paste the code from the documentation:
    `https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs`

> client.js:
---
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
---

> server.js:
---
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet, _headers) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
---

- >> Remove the typescript features from these files.

- We also need the `Next.js Proxy` file(s)
- These will be helping us when we are setting up the `user Authentication` inside of our application
- Create a new file in the main project directory called `proxy.js`
    > Paste the code from the documentation.
    - >> Remove the TS code from this file.

- Now create the `middleware.js` file in the `utils/supabase` directory.

[The documentation suggests putting it in the `lib/supabase` directory but we will keep all the backend `Node.js` code in one directory]

- Paste the second set of documentation code:
---
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  await supabase.auth.getClaims()

  return supabaseResponse
}
---

- Remove the Typescript from this code.

# Website - Dashboard
---
- Let's set up our `Authentication`

[We want to add `Google` Authentication]

- In the `Authentication` tab, select `Sign In/Providers`
- Enable Google.

- Now we need the `Client ID` and `Client Secret` [refer to documentation...]

- Google Cloud, create project, or use existing and all that other stuff....

[
    We get the `Client ID` and `Client Secret` from Google Cloud
    > Google Auth Platform > Clients > Create new Client > Web Application:
    - Add Name
    - Add Authorized redirect URIs (Get this from Supabase : Enable Google, Copy the `Callback URL (for OAuth)`), paste this URL
    - Create

    - Get the `Client ID` and the Client Secret, paste in Supabase
    - Save, and Save
]



- Now, In the `components` folder, create a new file called `AuthModal.js`
- `rafce`
- In here we will be creating a `dialog`
    > Check the syntax on ShadCN UI
    > Copy and Paste
    > Alter it to what we need

- Create a new component called `AuthButton.jsx`
- Copy the code of the button that we had in the <header></header> and paste in in this component.


- Create a `showAuthModal` state.
- Add a state called `showAuthModal`.
- Inside this AuthButton, import our `AuthModal`.
---
<AuthModal 
    isOpen={showAuthModal}
    onClose={() => setShowAuthModal(false)}
/>

---

- Add an `onClick` trigger to the <Button> so that when it is clicked on, it should `setShowAuthModal(true)`

---
"use client";

import React, { useState } from 'react'
import { Button } from './ui/button'
import { LogIn } from 'lucide-react'
import { AuthModal } from './AuthModal';

const AuthButton = ({ user }) => {

  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
        <Button
            onClick={() => setShowAuthModal(true)}
            variant="default" 
            size="sm"
            className={"bg-orange-500 hover:bg-orange-600 gap-2"}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>

          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
    </>
  )
}

export default AuthButton

---

- Replace the <Button></Button> code in `page.jsx` with <AuthButton user={user} />

- >> Test it out!!

- At this point, the `AuthModal.js`:

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AuthModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          
          
        </DialogContent>
    </Dialog>
  )
}

- the `AuthButton.jsx`

"use client";

import React, { useState } from 'react'
import { Button } from './ui/button'
import { LogIn, LogOut } from 'lucide-react'
import { AuthModal } from './AuthModal';

const AuthButton = ({ user }) => {

  const [showAuthModal, setShowAuthModal] = useState(false);

  // if the user is Logged In, then Render:
  if( user ) {
    return (
        <form action={() => {}}>
            <Button variant='ghost' size='sm' type="submit" className={"gap-2"}>
                <LogOut className='w-4 h-4' />
                Sign Out
            </Button>
        </form>
    );
  }

  // Else
  return (
    <>
        <Button
            onClick={() => setShowAuthModal(true)}
            variant="default" 
            size="sm"
            className={"bg-orange-500 hover:bg-orange-600 gap-2"}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>

          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
    </>
  )
}

export default AuthButton

---



# Sign In - Functionality
---
- Inside of `AuthModal.js`
- Provide DialogTitle and DialogDescription.
- Add a <Button></Button>, that says `Continue with Google`
    > onClick={handleGoogleLogin}

- Create a function called `handleGoogleLogin`
- create a variable called `supabase`:
    const supabase = createClient();
    > This `createClient` comes from our `utils/supabase/client.js`

- The `handleGoogleLogin`:
const handleGoogleLogin = async() => {
    // take whatever the ORIGIN of our window is
    const { origin } = window.location;

    await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`,
        }
    })
}

- >> NOTICE THE `${origin}/auth/callback`, **we need to create this API to receive the `TOKEN`**
- In `app` create the folders `auth/callback`
- In the `callback` directory create a `route.js` file.

- Create function : [Ready to recieve the response....]
---
// Receive the response...
export async function GET(request) {
    
}

---

- The complete `route.js` file:
---
import { createClient } from "@/utils/supabase/server";

// Receive the response...
export async function GET(request) {
    const { searchParams } = new URL(request.url); // take the request URL, whatever we are getting from Google
    const code = searchParams.get("code"); // get the code from our URL that Google is sending us

    if( code ) {
        const supabase = await createClient(); // from the server side
        await supabase.auth.exchangeCodeForSession(code); // exchange the code for a session
    }

    return NextResponse.redirect(new URL("/", request.url)); // redirect to the home page after logging in

}

---

> Write the logic for the `LOGOUT`
- In the `app` directory, create a new file called `actions.js`
- This file is strictly to be used on the `server`, so make it a `server component`
  > "use server";

- Write the functionalit using the `const supbase = await createClient()` variable.
- Now take this function and use it in the `AuthButton` component, if the `user` is `logged in`.
---
if( user ) {
  return (
      <form action={() => {signOut}}>
          <Button variant='ghost' size='sm' type="submit" className={"gap-2"}>
              <LogOut className='w-4 h-4' />
              Sign Out
          </Button>
      </form>
  );
}

---
> Note the `signOut` function that is being imported from `app/actions`

>> Don't forget to remove the hardcoded `const user = null` and replace it with the `authentication code` from `supabase`:
>> We should also make the `Home` page/component `async`:
>> From the supabase variable, remove the `user` as `data`:

---
export default async function Home() {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  .
  .
  .
  .
}

---

[
>> NOTE
- The signOut function won't work if you currently just reference the signOut as it is in the code:
if( user ) {
  return (
      <form action={() => {signOut}}>
          <Button variant='ghost' size='sm' type="submit" className={"gap-2"}>
              <LogOut className='w-4 h-4' />
              Sign Out
          </Button>
      </form>
  );
}

- Because you are `referencing` the function, not `calling` it,

it needs to be called:

<form action={signOut}>
]

>> *Authentication successfully added to project*

- If the user is logged in and there are no products being tracked yet, display a section to prompt them to start tracking.


# Creating the Tables In Database
---
- We will have 2 tables:
  > Products
  > Product History

- Create a table called `products`
*[Make sure to Enable Row Level Security !!]*
  > id : uuid (generate_random_uuid())
  > created_at : timestamp (now())
  > user_id : uuid (NULL value) -> Settings : Untick Is Nullable
  [Foreign Key -^]
  > url : text (NULL value) -> Settings: Untick Is Nullable
  > ......

id


uuid
gen_random_uuid()



created_at


timestamptz
now()




user_id


uuid
NULL




url


text
NULL




name


text
NULL




current_price


numeric
NULL




currency


text
ZAR




image_url


text
NULL


1


updated_at


timestamp
now()


- In the `Foreign Keys` section, add the foreign key
  > Select the `Auth` table (`schema`)
  > Select `users` (table to reference)
  > user_id -> id

  You can set the relationship action to `CASCADE`, but let's forget about this for now!

- Let's create another table called `price_history`
.
.
.
*[Delete `created_at` column]*

- Add a constraint to the products table
  > This constraint prevents users from entering the same product twice
  > Go to "SQL Editor" for `products` and enter `ALTER TABLE products ADD constraint products_user_url_unique UNIQUE(user_id, url)`
  > RUN

- Add policies to the `products` table
  > Database > Policies
  > `Products table` > `Create Policy`
  > Policy name : Users can view their own products
  > Policy command for clause : `SELECT`
  > Target roles to clause : `AUTHENTICATED`
  > Add the line : `(auth.uid() = user_id)`
  > Save policy

- Add another policy : `User can insert their own products`
  > `INSERT`
  > (auth.uid() = user_id)

- Add another policy : `Users can update their own products`
  > UPDATE
  > (auth.uid() = user_id)

- Add the last `DELETE` policy : `Users can delete their own products`
  > DELETE
  > (auth.uid() = user_id)

- Create a policy for `price_history` : `Users can view price history for their products`
  > `SELECT`
  > Enter the query statement : `EXISTS (SELECT 1 FROM products WHERE products.id = price_history.product_id AND products.user_id = auth.uid())`

- >> Make sure to set `APPLIED TO` to `authenticated`

- >> Add `indexes` to the tables for `faster` searching. (SQL Editor)
  > CREATE INDEX products_user_id_idx ON products(user_id);
  > CREATE INDEX price_history_product_id_idx ON price_history(product_id);
  > CREATE INDEX price_history_checked_at_idx ON price_history(checked_at DESC);

## Functionality - Paste URL, Scrape Data, Display Information about Product(s)
---

- Install the dependency
  > npm i @mendable/firecrawl-js
  > Although check for the different versions how to install

- Inside the `lib` folder, create a new file called `firecrawl.js`
- Create a `new instance` for `firecrawl`

---
import Firecrawl from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlAppV1({ apiKey: process.env.FIRECRAWL_API_KEY });

// create a server action
export async function scrapeProduct(url) {
    try {
        const result = await firecrawl.scrape(url, {
            // options
            formats: 
            [
                {
                    type: 'json', 
                    schema: {
                        type: 'object',
                        required: ["productName", "currentPrice"],
                        properties: {
                            productName: {
                                type: 'string',
                            },
                            currentPrice: {
                                type: "string",
                            },
                            currencyCode: {
                                type: 'string',
                            },
                            productImageUrl: {
                                type: 'string',
                            },
                        },
                    },
                    prompt: 'Extract the product name as "productName", current price as a number as "currentPrice", currency code (USD,EUR,etc) as "currencyCode", and product image URL as "productImageUrl" if valid.',
                }
            ],
        });

        const extractedData = result.json;

        if( !extractedData || !extractedData.productName ) {
            throw new Error("No data extracted from URL");
        }

        return extractedData;
    } catch (error) {
        console.error("Firecrawl scrape error: ", error);
        throw new Error(`Failed to scrape product : ${error.message}`);
    }
}

---

- Now let's create the `server action` for adding the product to our database
- Go to `actions.js`
- Create a new function called `addProduct(formData)`:

export async function addProduct(formData) {
    
}

- The complete function:
---
export async function addProduct(formData) {
    const url = formData.get("url"); // we're just sending through the URL

    if(!url) {
        return {error: "URL is required"};
    }

    try {
        // make call to our database

        const supabase = await createClient(); // from the server

        // get user
        const {
            data: {user},
        } = await supabase.auth.getUser();

        // check if user is logged in or not
        if(!user) {
            return { error: "Not authenticated" };
        }

        // scrape product data with Firecrawl
        const productData = await scrapeProduct(url);

        // check productName and productPrice
        if( !productData.productName || !productData.currentPrice ) {
            console.log(productData, "productData");
            return { error: "Could not extract product information from this URL" };
        }

        // take our price and currency
        const newPrice = parseFloat(productData.currentPrice);
        const currency = productData.currencyCode || "USD";

        // if the product already exists, we'll simply update it
        const { data:existingProduct } = await supabase
            .from("products")
            .select("id, current_price")
            .eq("user_id", user.id)
            .eq("url", url)
            .single(); 

        const isUpdate = !!existingProduct;

        // upsert product (insert or update based on user_id + url)
        const { data: product, error } = await supabase.from("products").upsert({
            user_id: user.id,
            url,
            name: productData.productName,
            current_price: newPrice,
            currency: currency,
            image_url: productData.imageUrl,
            updated_at: new Date().toISOString(),
        },{
            onConflict: "user_id,url", // unique constraint on user_id + url, to avoid duplicates
            ignoreDuplicates: false, // always update if exists
        }
    )
        .select()
        .single();

        if( error ) {
            throw error;
        }

        // Add to price history if it's a new product or if the price has changed
        const shouldAddHistory = !isUpdate || existingProduct.current_price !== newPrice;

        if( shouldAddHistory ) {
            await supabase.from("price_history").insert({
                product_id: product.id,
                price: newPrice,
                currency: currency,
            });
        }

        revalidatePath("/");

        return {
            success: true,
            product,
            message: isUpdate ? "Product updated with latest price!" : "Product added successfully!",
        };

    } catch (error) {
        console.error("Error adding product:", error);
        return { error: error.message || "Failed to add product" };
    }
}

---

- Create other server actions
  > deleteProduct(productId) :  `delete` a product using the specific ID
  > getProducts : `fetch` all products
  > getPriceHistory(productId) : `fetch` price history for a specific product


- Now that we have our server functions, go back to `AddProductForm.jsx`
- Create/Continue scripting the `handleSubmit` function
  > don't forget `e.preventDefault()`

[
In `layout.js`, underneath `{children}`, add <Toaster richColors />
  > import { Toaster } from "@/components/ui/sonner";
]

# Done!!

---

## Render Tracking Products
---

- In our `page.jsx`, we had:
  > const products = [];
- Change it to:
  > const products = user ? await getProducts() : [];
  > import `getProducts` from our `actions.js`!!

- Take the products and create the `div` that will display them
  > Start with the `Div Title` and `Product Count`
  > Map through the products
    - Display the products using a component `<ProductCard key={product.id} product={product} />`

- Create the `<ProductCard />` component

import React from 'react'

const ProductCard = ({ product }) => {
  return (
    <div>ProductCard</div>
  )
}

export default ProductCard

- Make it a `client component`, because we will be having `hooks`
  > "use client";

- Add the states:
  > const [showChart, setShowChart] = useState(false);
  > const [deleting, setDeleting] = useState(false);

- Create the `handleDelete` function.

- Now, let's create the UI/UX for the Product Card
  > We will use ShadCN's `Card` component

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>

- So copy and paste from documentation, handle imports, tweek to our liking!

- To display the chart we will use a library called `Recharts`
  > https://recharts.github.io/

- >> npm install recharts

- Create a new component called `PriceChart`, provide the productId

"use client";

import React, { useState } from 'react'

const PriceChart = ({ productId }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div>PriceChart</div>
  )
}

export default PriceChart

- 

- In the `CardFooter`, place the `PriceChart component`


--- Good Idea ---
## Upload to GitHub
-----------------


# Continuing...
---

- For the sake of testing, lets manually add price history for the product.
> The graph is displaying correctly!


# Let's `implement` our `alert`
- Let's create the `endpoint` for it! And then we'll set up the `CRON JOB` for it.

- In the `app` folder, create a new directory called `api`
- Create a folder called `cron` in this `api` dir.
- In the `cron` create a folder called `check-prices`
- In this dir, create a file called `route.js`

- In this file create 2 functions:
  > export async function GET() {}
  > export async function POST(request) {}

  - The POST needs a secret, so to create one, in the terminal:
    > `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
    > This will help us generate a secure string
    
  - Add this string as an ENVIRONMENT VARIABLE called `CRON_SECRET`

- The `POST` method, is used to check the prices : `CRON JOB`

- Now write the `logic` for `sending` the `email`.
  > We will be using a service called `resend`
  > https://resend.com/
  
  > Go to `API Keys`
  > Create an API Key
  > Copy API Key
  > Add to `.env` file as `RESEND_API_KEY`
  > ADD the email address that we will be receiving from as well as an ENVIRONMENT VAR:
    - RESEND_FROM_EMAIL=onboarding@resend.dev


- >> To send an email, we will need to create a template for how the Email will look and be structured

# Create the Email Template
---

- In the `lib` folder, create a new file called `email.js`
- In this file, create a function called `sendPriceDropAlert`

---
export async function sendPriceDropAlert(userEmail, product, oldPrice, newPrice) {
    
}
---

- Add this function and result logic to the `route.js` file:

if(user?.email) {
    // Send Email
    const emailResult = await sendPriceDropAlert(
        user.email,
        product,
        oldPrice,
        newPrice
    );

    if( emailResult.success ) {
        results.alertsSent++;
    }
}

- We need to `initialize` the `resend`
- Install resend
  > npm i resend

- In the `email.js` file, `initialize Resend`
- `Calculate` the `percentage drop`
- Construct the object to send:

const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: userEmail,
    subject: `🎉 Price Drop Alert: ${product.name}`,
    html: ``,
});

- Check for `errors`
- `Return success and data`

- For the `html`:
  > Build the HMTL

- To `test` this we need to `deploy` our application.

---
# Deploy PricePulse!!
---