import { shopifyAdminFetch } from './shopifyAdmin';

/**
 * Create or update a customer in Shopify
 * @param customerData Customer data to create or update
 * @returns The created or updated customer data from Shopify
 */
export async function createOrUpdateShopifyCustomer(customerData: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    address1?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
  };
}) {
  try {
    // First, check if the customer already exists
    const existingCustomer = await findCustomerByEmail(customerData.email);

    if (existingCustomer) {
      // Update existing customer
      return await updateShopifyCustomer(existingCustomer.id, customerData);
    } else {
      // Create new customer
      return await createShopifyCustomer(customerData);
    }
  } catch (error) {
    console.error('Error creating or updating Shopify customer:', error);
    throw error;
  }
}

/**
 * Find a customer in Shopify by email
 * @param email Customer email to search for
 * @returns The customer data if found, null otherwise
 */
export async function findCustomerByEmail(email: string) {
  try {
    const query = `
      query FindCustomerByEmail($email: String!) {
        customers(first: 1, query: $email) {
          edges {
            node {
              id
              email
              firstName
              lastName
              phone
              defaultAddress {
                address1
                city
                province
                zip
                country
              }
            }
          }
        }
      }
    `;

    const { status, body } = await shopifyAdminFetch({
      query,
      variables: { email },
    });

    // Type assertion for the response body
    const typedBody = body as { data?: { customers?: { edges?: Array<{ node: any }> } } };

    if (status === 200 && typedBody?.data?.customers?.edges && typedBody.data.customers.edges.length > 0) {
      return typedBody.data.customers.edges[0].node;
    }

    return null;
  } catch (error) {
    console.error('Error finding Shopify customer by email:', error);
    return null;
  }
}

/**
 * Create a new customer in Shopify
 * @param customerData Customer data to create
 * @returns The created customer data from Shopify
 */
export async function createShopifyCustomer(customerData: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    address1?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
  };
}) {
  try {
    const mutation = `
      mutation CustomerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const input = {
      email: customerData.email,
      firstName: customerData.firstName || '',
      lastName: customerData.lastName || '',
      phone: customerData.phone || '',
      addresses: customerData.address ? [
        {
          address1: customerData.address.address1 || '',
          city: customerData.address.city || '',
          province: customerData.address.province || '',
          zip: customerData.address.zip || '',
          country: customerData.address.country || '',
        }
      ] : []
    };

    const { status, body } = await shopifyAdminFetch({
      query: mutation,
      variables: { input },
    });

    // Type assertion for the response body
    const typedBody = body as {
      data?: {
        customerCreate?: {
          customer: any;
          userErrors?: Array<{ field: string; message: string }>
        }
      }
    };

    if (status === 200) {
      if (typedBody?.data?.customerCreate?.userErrors && typedBody.data.customerCreate.userErrors.length > 0) {
        console.error('Shopify customer creation errors:', typedBody.data.customerCreate.userErrors);
        throw new Error(typedBody.data.customerCreate.userErrors[0].message);
      }

      return typedBody?.data?.customerCreate?.customer;
    }

    throw new Error(`Failed to create Shopify customer: ${status}`);
  } catch (error) {
    console.error('Error creating Shopify customer:', error);
    throw error;
  }
}

/**
 * Update an existing customer in Shopify
 * @param customerId Shopify customer ID
 * @param customerData Customer data to update
 * @returns The updated customer data from Shopify
 */
export async function updateShopifyCustomer(
  customerId: string,
  customerData: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: {
      address1?: string;
      city?: string;
      province?: string;
      zip?: string;
      country?: string;
    };
  }
) {
  try {
    const mutation = `
      mutation CustomerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const input = {
      id: customerId,
      email: customerData.email,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      phone: customerData.phone,
    };

    const { status, body } = await shopifyAdminFetch({
      query: mutation,
      variables: { input },
    });

    // Type assertion for the response body
    const typedBody = body as {
      data?: {
        customerUpdate?: {
          customer: any;
          userErrors?: Array<{ field: string; message: string }>
        }
      }
    };

    if (status === 200) {
      if (typedBody?.data?.customerUpdate?.userErrors && typedBody.data.customerUpdate.userErrors.length > 0) {
        console.error('Shopify customer update errors:', typedBody.data.customerUpdate.userErrors);
        throw new Error(typedBody.data.customerUpdate.userErrors[0].message);
      }

      return typedBody?.data?.customerUpdate?.customer;
    }

    throw new Error(`Failed to update Shopify customer: ${status}`);
  } catch (error) {
    console.error('Error updating Shopify customer:', error);
    throw error;
  }
}
