<template>
    <div class="contact-details">
        <h4>Contact Info</h4>

        <div v-if="contact">
            <div><span class="item-label">Phone Number</span>: {{ contact.phone }}</div>
            <div><span class="item-label">Email</span>: {{ contact.email }}</div>

            <h5 class="mt-3">Address</h5>

            <div>
                {{ contact.address.streetAddr }}<br/>
                {{ contact.address.city }}, {{ contact.address.stateCode }}, {{ contact.address.postalCode }}
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "ContactDetails",
        props: {
            contact: Object,
        },
    }
</script>

<style lang="scss">

</style>