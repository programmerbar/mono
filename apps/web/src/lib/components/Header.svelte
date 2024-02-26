<script lang="ts">
	const links = [
		{
			name: 'Hjem',
			href: '/'
		},
		{
			name: 'Frivillige',
			href: '/frivillige'
		},
		{
			name: 'Booking',
			href: 'https://forms.google.com'
		},
		{
			name: 'Om oss',
			href: '/om-oss'
		}
	];
</script>

<div class="border-b-2 border-black">
	<header class="flex items-center justify-between p-4">
		<div>
			<a class="text-3xl font-medium" href="/">Programmerbar</a>
		</div>

		<div>
			<nav>
				<ul class="flex items-center gap-4">
					{#each links as { href, name }}
						{@const isExternal = href.startsWith('http')}
						<li>
							<a
								class="text-lg text-gray-600 stroke-gray-600 stroke-2 flex items-center gap-1 hover:text-gray-900 hover:stroke-gray-900 hover:underline"
								{href}
								target={isExternal ? '_blank' : undefined}
								rel={isExternal ? 'noopener noreferrer' : undefined}
							>
								<span>
									{name}
								</span>
								{#if isExternal}
									<svg
										width="18px"
										height="18px"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g>
											<path
												id="Vector"
												d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
											/>
										</g>
									</svg>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</header>
</div>
