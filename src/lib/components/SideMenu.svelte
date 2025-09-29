<script lang="ts">
	import Spinner from './Spinner.svelte';

	let loading = $state(false);
	type SideMenuType = {
		project: Project;
		documents: Array<Document_>;
	};
	const { project, documents }: SideMenuType = $props();
</script>

<div
    class="fixed flex flex-col bottom-0 top-0 left-0 w-[78px] hover:w-[304px] min-h-[100vh] bg-[#F9FAFC] border-r border-r-[#EBECF2] p-4 transition-w duration-100 ease-out dashboard-sidemenu z-50 overflow-y-scroll"
  >
	<a class="flex flex-row pt-[2px]" href="/">
		<img alt="brand-logo" class="inline-block h-10 w-auto" src="/assets/images/omniglot_logo.png" />
		<span
			class="inilne-block dashboard-sidemenu__text pl-2 transition-opacity duration-150 ease-out"
		>
			<img alt="brand-logo" class="h-10 w-auto" src="/assets/images/omniglot_logo_text.png" />
		</span>
	</a>
	<div class="h-full pb-3">
		<ul class="flex h-full flex-col" data-sveltekit-reload>
			<li class="min-h-14 min-w-2">
				<div
					class="dashboard-sidemenu__text dashboard-sidemenu__text--full w-full py-4 pl-2 text-lg transition-opacity duration-15 ease-out"
				>
					{project.name}
				</div>
			</li>
			{#each documents as document}
				<a
					onclick={() => {
						loading = true;
					}}
					class="mt-1 mb-2 block"
					href={`/project/${project.url_key}/document/${document.url_key}`}
				>
					<li
						class="flex flex-row rounded-full border px-3 py-2 text-center hover:border-[#EBECF2] hover:shadow-lg"
					>
						<span class="inline-block {document.order_id.toString().length <= 1 ? 'pl-1' : ''}">
							{document.order_id}
						</span>
						<span
							class="dashboard-sidemenu__text shrink pl-2 transition-opacity duration-150 ease-out"
						>
							{document.name}
						</span>
					</li>
				</a>
			{/each}

			<a
				onclick={() => {
					loading = true;
				}}
				class="mt-1 mb-2 block"
				href={`/project/${project.url_key}/document/new`}
			>
				<li
					class="flex flex-row rounded-full border bg-white px-3 py-2 text-center hover:border-[#EBECF2] hover:shadow-lg"
				>
					<span class="inline-block pl-1"> + </span>
					<span
						class="dashboard-sidemenu__text shrink pl-2 transition-opacity duration-150 ease-out"
					>
						New Document
					</span>
				</li>
			</a>
		</ul>
		{#if loading}
			<div
				class="fixed top-0 right-0 bottom-0 left-0 z-20 flex place-content-center justify-center p-4 text-[#333]"
				style="background-color: rgba(0, 0, 0, 0.3)"
			>
				<div class="m-auto text-center">
					<Spinner className="inline-block" />
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.dashboard-sidemenu__text {
		text-align: left;
		overflow-x: hidden;
		display: none;
		opacity: 0;
		width: 240px;

		&--full {
			width: 100%;
		}
	}

	.dashboard-sidemenu {
		-ms-overflow-style: none;
		scrollbar-width: none;

		&:hover {
			.dashboard-sidemenu__text {
				display: block;
				opacity: 1;
			}
		}

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.dashboard-sidemenu__item--selected {
		background-color: white;
	}
</style>
