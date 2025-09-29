

<script lang='ts'>
  let {modelValue = $bindable()} = $props();
</script>


  <textarea
    class="text-base block w-full px-3 py-2 my-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-[#eb008c] focus:ring-1 focus:ring-[#eb008c] disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border- invalid:text-[#d0011d] focus:invalid:border-[#d0011d] focus:invalid:ring-[#d0011d]"
    bind:value={modelValue}
  ></textarea>
