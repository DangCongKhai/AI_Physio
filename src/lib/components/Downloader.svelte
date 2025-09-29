<script lang="ts">
	import pkg from 'file-saver';
	const { saveAs } = pkg;
	import { Document as DocxDocument, Paragraph, TextRun, Packer } from 'docx';

	interface Chapter {
		title: string;
		id: string;
		// ...other fields as needed
	}
	type SideMenuType = {
		project: Project;
		documents: Document_[];
		chapters?: Chapter[];
	};
	let { project, documents, chapters = [] }: SideMenuType = $props();

	let isDisplayed = $state(false);
	let loading = $state(false);

	const itemsToCsv = (items: { source: string; target: string }[]) => {
		let csv = '';
		const headers = ['#', 'source', 'target'];

		csv += headers.join(',') + '\n';
		items.forEach((item, idx) => {
			let formattedItem = [idx, JSON.stringify(item.source), JSON.stringify(item.target)].join(',');
			csv += formattedItem + '\n';
		});
		return csv;
	};

	const downloadCsv = async () => {
		loading = true;

		let allItems: { source: string; target: string; id: number }[] = [];
		const documentIds = documents.map((d) => d.id);
		for (const documentId of documentIds) {
			const response = await fetch(
				`/api/download/project/${project.id}/document/${documentId}/page-count`,
				{
					method: 'GET'
				}
			);
			const { pageCount } = await response.json();

			for (let page = 0; page < pageCount; page++) {
				const itemsResponse = await fetch(
					`/api/download/project/${project.id}/document/${documentId}/page/${page}/source-target`,
					{
						method: 'GET'
					}
				);
				const items = await itemsResponse.json();
				if (Array.isArray(items)) {
					items.sort((a, b) => a.id - b.id);
					allItems = [...allItems, ...items];
				}
			}
		}

		const csvData = itemsToCsv(allItems);
		const blob = new Blob([csvData], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		const fileName = project.name.replace(' ', '_').toLowerCase();
		a.href = url;
		a.download = `${fileName}.csv`;
		document.body.appendChild(a);
		a.click();

		loading = false;
	};

	const generateDoc = async (allParas: { title: string; content: string }[]) => {
		let paragraphs = [];
		for (const para of allParas) {
			const formattedPara = new Paragraph({
				style: 'text',
				children: [
					new TextRun({
						text: para.content,
						break: 1
					})
				]
			});
			paragraphs.push(formattedPara);
		}

		const doc = new DocxDocument({
			sections: [{ children: paragraphs }]
		});
		return doc;
	};

	const downloadText = async () => {
		loading = true;

		let text = '';
		for (const chapter of chapters) {
			const response = await fetch(
				`/api/download/project/${project.id}/document/${chapter.id}/page-count`,
				{
					method: 'GET'
				}
			);
			const { pageCount } = await response.json();
			for (let page = 0; page < pageCount; page++) {
				const itemsResponse = await fetch(
					`/api/download/project/${project.id}/document/${chapter.id}/page/${page}/target`,
					{
						method: 'GET'
					}
				);
				const items = await itemsResponse.json();
				if (Array.isArray(items)) {
					items.sort((a, b) => a.id - b.id);
					const content = items
						.filter((item) => item.target) // Filter out items with empty target
						.map((item) => item.target)
						.join(' ');
					text += `${content}\n\n`;
				}
			}
		}

		const blob = new Blob([text], { type: 'text' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		const fileName = project.name.replace(' ', '_').toLowerCase();
		a.href = url;
		a.download = `${fileName}.txt`;
		document.body.appendChild(a);
		a.click();

		loading = false;
	};

	const downloadDoc = async () => {
		loading = true;

		let allParas: { title: string; content: string }[] = [];
		for (const chapter of chapters) {
			const response = await fetch(
				`/api/download/project/${project.id}/document/${chapter.id}/page-count`,
				{
					method: 'GET'
				}
			);
			const { pageCount } = await response.json();
			for (let page = 0; page < pageCount; page++) {
				const itemsResponse = await fetch(
					`/api/download/project/${project.id}/document/${chapter.id}/page/${page}/target`,
					{
						method: 'GET'
					}
				);
				const items = await itemsResponse.json();
				if (Array.isArray(items)) {
					items.sort((a, b) => a.id - b.id);
					const content = items
						.filter((item) => item.target) // Filter out items with empty target
						.map((item) => item.target)
						.join(' ');
					allParas.push({
						title: chapter.title,
						content: `${content}\n\n`
					});
				}
			}
		}

		const doc = await generateDoc(allParas);
		const mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
		Packer.toBlob(doc).then((blob) => {
			const docBlob = blob.slice(0, blob.size, mimeType);

			saveAs(blob, `${project.name.replace(' ', '_').toLowerCase()}.docx`);
		});

		loading = false;
	};

	const open = () => {
		isDisplayed = true;
	};

	const close = () => {
		isDisplayed = false;
	};
</script>

<button
	class="float-right rounded-full border border-transparent p-2 hover:border-[#EBECF2] hover:shadow-sm"
	onclick={open}
>
	<img alt="Download" src="/assets/icon/Download.svg" class="h-5 w-5" />
</button>

{#if isDisplayed}
	<div
		class="backdrop fixed top-0 right-0 bottom-0 left-0 z-50 flex content-center items-center bg-[#0003] p-4"
	>
		<div class="m-auto rounded-lg bg-white">
			<div class="m-auto rounded-lg bg-white px-6 pt-4 pb-6">
				<div class="flex flex-row pb-4">
					<h1 class="w-full text-2xl font-semibold">Download</h1>
					<button
						class="h-8 w-8 rounded-full p-2 font-semibold text-white hover:drop-shadow-md"
						onclick={close}
					>
						<img alt="Download" src="/assets/icon/Cross.svg" class="h-6 w-auto fill-[#666]" />
					</button>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div class="col-span-1 flex flex-col">
						<button
							class="transition-w rounded-lg border border-[#DDD] p-8 text-center duration-100 hover:shadow-md"
							onclick={downloadCsv}
						>
							<div class="text-lg">Download as CSV</div>
							<div class="text-sm">Source + Target</div>
						</button>
					</div>
					<div class="col-span-1 flex flex-col">
						<button
							class="transition-w rounded-lg border border-[#DDD] p-8 text-center duration-100 hover:shadow-md"
							onclick={downloadDoc}
						>
							<div class="text-lg">Download as text</div>
							<div class="text-sm">Target Only</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.backdrop {
		--backdrop-blur: blur(4px);
		-webkit-backdrop-filter: var(--backdrop-blur) var(--backdrop-brightness)
			var(--backdrop-contrast) var(--backdrop-grayscale) var(--backdrop-hue-rotate)
			var(--backdrop-invert) var(--backdrop-opacity) var(--backdrop-saturate) var(--backdrop-sepia);
		backdrop-filter: var(--backdrop-blur) var(--backdrop-brightness) var(--backdrop-contrast)
			var(--backdrop-grayscale) var(--backdrop-hue-rotate) var(--backdrop-invert)
			var(--backdrop-opacity) var(--backdrop-saturate) var(--backdrop-sepia);
	}
</style>
